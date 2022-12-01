# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy
from scrapy.loader import ItemLoader
from itemloaders.processors import TakeFirst, MapCompose
from w3lib.html import remove_tags


def fixDateForEvent(date):
    if date is "Today":
        pass
    elif date is "Tomorrow":
        pass
    
    return date

class EventItem(scrapy.Item):
    title = scrapy.Field()
    genre = scrapy.Field()
    date = scrapy.Field(input_processor = MapCompose(fixDateForEvent))
    venue = scrapy.Field()
    ticket_url = scrapy.Field()
    event_url = scrapy.Field()


class VenueItem(scrapy.Item):
    pass