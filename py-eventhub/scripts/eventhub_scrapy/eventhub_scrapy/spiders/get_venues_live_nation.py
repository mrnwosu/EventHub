import scrapy
import json
import time
import asyncio
import os
from scrapy_playwright.page import PageMethod


from bs4 import BeautifulSoup


class GetVenuesLiveNationSpider(scrapy.Spider):
    name = 'get_venues_live_nation'
    allowed_domains = ['www.livenation.com']
    custom_settings = {
            'airtable_table':'Venues',
            'match': ['name'],
        }

    def start_requests(self):
        meta={
            'playwright': True,
            'playwright_include_page': True,
            'playwright_page_methods': [
                PageMethod("click", selector='.show-more'),
            ]}

        yield scrapy.Request('https://wxww.livenation.com/venues', meta=meta, errback=self.errback)
        
    
    async def parse(self, response):
        page = response.meta['playwright_page']
        soup = BeautifulSoup(await page.content(), 'html.parser')
        await page.close()
        detail_cards = soup.select('.common-detail-card')

        for card in detail_cards:
            city_state = card.select_one('p').get_text()
            name = card.select_one('h3.legacy').get_text()
            image_url = card.select_one('img')['src']
            venue_url = card.select_one('nav a')['href']

            yield {
                'city': city_state.split(', ')[0],
                'state': city_state.split(', ')[1],
                'name': name,
                'image_url': None,
                'venue_url': f'https://livenation.com{venue_url}',
            }

        


    async def errback(self, failure):
        page = failure.request.meta["playwright_page"]
        await page.close()