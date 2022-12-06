import scrapy
import json
import time
import os
from eventhub_scrapy.items import EventItem
from scrapy_playwright.page import PageMethod
from scrapy.selector import Selector

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
        meta = {
            'playwright': True,
            'playwright_include_page': True
        }
        
        filmore_urls = list(filter(lambda u: 'silver' in u, urls))
        for url in filmore_urls:
            yield scrapy.Request(url, meta=meta, errback=self.errback)
        
    async def parse(self, response):
        page = response.meta['playwright_page']
        while True:
            try:
                await page.locator('button.chakra-button').click({timeout:10})
            except:
                break

        s  = Selector(text=await page.content())
        await page.close()

        venue_name = self.getTextOrAttr(s, '.venue-title')
        for item in s.css('.listing__item'):
            e = EventItem()
            e['title'] = self.getTextOrAttr(item, '.legacy')
            e['date'] = self.getTextOrAttr(item, '.listing__badge time','datetime')
            e['genre'] = self.getTextOrAttr(item, 'header h4')
            e['ticket_url'] = self.getTextOrAttr(item, '.listing__hover-button-container a','href')
            e['venue'] = venue_name
            yield e

    def getTextOrAttr(self, soup, cssSelector, attr=None):
        elem = soup.css(cssSelector)
        if elem is None:
            return ""
        
        try:
            if attr is None:
                result =  elem.css('::text').get()
                return result if result is not None else ""
            
            result = elem.css(f'::attr({attr})').get()
            return result if result is not None else ""
        except:
            return ""
    

    async def errback(self, failure):
        page = failure.request.meta["playwright_page"]
        await page.close()