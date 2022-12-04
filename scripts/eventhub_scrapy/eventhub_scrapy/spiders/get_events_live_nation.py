import scrapy
import json
import time
import os
from eventhub_scrapy.items import EventItem
from scrapy_playwright.page import PageMethod

from bs4 import BeautifulSoup


class GetEventsLiveNationSpider(scrapy.Spider):
    name = 'get_events_live_nation'
    allowed_domains = ['www.livenation.com']
    custom_settings = {
            'airtable_table':'Events',
            'match': ["title", "date"],
        }

    def start_requests(self):
        file = open('../../data/venues-urls.json')
        content = file.read()
        urls = json.loads(content)

        filmore_urls = list(filter(lambda u: "fillmore" in u, urls))

        for url in filmore_urls:
            yield scrapy.Request(url,
                meta={
                    'playwright': True,
                    'playwright_include_page': True,
                    'playwright_page_methods': [
                        PageMethod("wait_for_selector", ".listing__item")
                    ]},
                    errback=self.errback,)
        
    async def parse(self, response):
        page = response.meta['playwright_page']
        time.sleep(5)
        
        pageHtml = await page.content()
        soup = BeautifulSoup(pageHtml, "html.parser")
        venue_name = soup.select_one('.venue-title').get_text()
        for eventSoup in soup.select('.listing__item'):
            e = item = EventItem()
            e['title'] = self.getTextOrAttr(eventSoup, '.legacy')
            e['date'] = self.getTextOrAttr(eventSoup, '.listing__badge time','datetime')
            e['genre'] = self.getTextOrAttr(eventSoup, 'header h4')
            e['ticket_url'] = self.getTextOrAttr(eventSoup, '.listing__hover-button-container a','href')
            e['venue'] = venue_name
            yield e

    def getTextOrAttr(self, soup, cssSelector, attr=None):
        elem = soup.select_one(cssSelector)
        if elem is None:
            return ""
        
        try:
            if attr is None:
                return elem.get_text()
            
            return elem[attr]
        except:
            return ""
    

    async def errback(self, failure):
        page = failure.request.meta["playwright_page"]
        await page.close()