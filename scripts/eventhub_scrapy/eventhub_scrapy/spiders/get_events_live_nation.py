import scrapy
import json
import time

from bs4 import BeautifulSoup


class GetEventsLiveNationSpider(scrapy.Spider):
    name = 'get_events_live_nation'
    allowed_domains = ['www.livenation.com']

    def start_requests(self):
        file = open('../../data/venues-urls.json')
        content = file.read()
        urls = json.loads(content)

        filmore_urls = list(filter(lambda u: "fillmore" in u, urls))

        for url in filmore_urls:
            yield scrapy.Request(url,
                meta={
                    'playwright': True,
                    'playwright_include_page': True},
                    errback=self.errback,)
        
    async def parse(self, response):
        venue_name = response.css('.venue-title::text').get()
        print(venue_name)

        page = response.meta['playwright_page']

        #Find work around for this wait.
        time.sleep(5)

        #Check for button. Find better way for this.
        while(True):
            try:
                await page.locator('.pagination > a').click({timeout:10})
            except:
                break



        pageHtml = await page.content()
        soup = BeautifulSoup(pageHtml, "html.parser")

        venue_name = soup.select_one('.venue-title .chakra-heading').get_text()
        location = soup.select_one('.location').get_text()

        for eventSoup in soup.select('.listing__item'):
            artist = eventSoup.select_one('.legacy').get_text()
            genre = eventSoup.select_one('header h4').get_text()
            date = eventSoup.select_one('.listing__badge time').get_text()
            ticket_url = eventSoup.select_one('.listing__hover-button-container a')['href']
            image_url = eventSoup.select_one('.listing__item__image_container img')['src']

            yield {
                'artist': artist,
                'genre' : genre,
                'date' : date,
                'ticket_url' : ticket_url,
                'image_url' : image_url,
                'venue_name' : venue_name,
                'location' : location,
            }
                

    async def errback(self, failure):
        page = failure.request.meta["playwright_page"]
        await page.close()