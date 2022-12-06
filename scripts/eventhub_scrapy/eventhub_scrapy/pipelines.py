# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from itemadapter import ItemAdapter


class EventhubScrapyPipeline:
    def process_item(self, item, spider):
        return item





from itemadapter import ItemAdapter
import os 
import sys
import json
import datetime
from scrapy.exceptions import DropItem

sys.path.insert(0, '../')
from air import AirtableService

class AirtableEventsPipeline:

    def __init__(self, tableName, match, api_key, base_id):
        self.tableName = tableName
        self.match = match
        print('Create New "AirtableService"')
        self.air_service = AirtableService(api_key, base_id)

    @classmethod
    def from_crawler(cls, crawler):
        print("Getting settings from crawler")
        return cls(
            tableName=crawler.settings.get('airtable_table'),
            match=crawler.settings.get('match'),
            api_key=crawler.settings.get('AIRTABLE_API_KEY'),
            base_id=crawler.settings.get('AIRTABLE_BASE_ID'),
        )

    def existsOnDb(self, table: str, item):   
        print("Checking if item exists on DB")
        match_dict = {}
        for field in self.match:
            match_dict[field] = item[field]
        
        records_in_db = self.air_service.get_records_by_match(table, match_dict)
        return records_in_db is not None and len(records_in_db) > 0
        
    def handleEvent(self, item):
        if item['date'] is None or item['date'] == "":
            raise DropItem('Event has no date.')

        print("Setting Venues for item.")
        venues = self.air_service.get_records_by_match('Venues', {'name':item['venue']})
        if len(venues) == 0:
            item['venue'] = None
        else:
            item['venue'] = [venues[0]['id']]

    def process_item(self, item, spider):
        print('Processing Item')
        print(f'Inside {self.tableName}')
        print(f'Inside {self.match}')

        dictItem = ItemAdapter(item).asdict()
        if self.existsOnDb(self.tableName, dictItem):
            raise DropItem(f"Event already exists on DB: {dictItem}")
        
        if self.tableName == "Events":
            self.handleEvent(dictItem)
                
        self.air_service.create_record(self.tableName, dictItem)

        return item            