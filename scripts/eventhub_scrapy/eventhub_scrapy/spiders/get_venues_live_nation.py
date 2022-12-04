import scrapy
import json
import time
import asyncio
import os

from bs4 import BeautifulSoup


class GetVenuesLiveNationSpider(scrapy.Spider):
    name = 'get_venues_live_nation'
    allowed_domains = ['www.livenation.com']

    def __init__(self, category=None, *args, **kwargs):
        super(GetVenuesLiveNationSpider, self).__init__(*args, **kwargs)
        self.custom_settings = {
            'airtable_table':'Venues',
            'match': ['name'],
            'api_key': os.environ.get('AIRTABLE_API_KEY'),
            'base_id': os.environ.get('AIRTABLE_BASE_ID'),
        }

    def start_requests(self):
        meta={
            'playwright': True,
            'playwright_include_page': True}

        yield scrapy.Request('https://www.livenation.com/venues', meta=meta, errback=self.errback)
        
    
    async def clickLoadMores(self,page):
        while(True):
            try:
                print('Clicking Pagination')
                await page.locator('.pagination > a').click({timeout:5})
                await page.waitFor(5000)
            except:
                break
        return True

    async def parse(self, response):
        page = response.meta['playwright_page']

        finished = await self.clickLoadMores(page)
        
        if finished is True:
            soup = BeautifulSoup(await page.content(), 'html.parser')
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
                    'image_url': "",
                    # 'image_url': image_url,
                    'venue_url': f'https://livenation.com{venue_url}',
                }

        


    async def errback(self, failure):
        page = failure.request.meta["playwright_page"]
        await page.close()