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

sys.path.insert(0, '../')
from air import AirtableService

class AirtableEventsPipeline:

    def getEnvirOrDefault(self, key, default):
        return os.environ.get(key) if os.environ.get(key) else default

    def __init__(self, tableName, match):
        api_key = self.getEnvirOrDefault('AIRTABLE_API_KEY', "")
        base_id = self.getEnvirOrDefault('AIRTABLE_BASE_ID', "")
        self.air_service = AirtableService(api_key,base_id)

        self.tableName = tableName
        self.match = match

    @classmethod
    def from_crawler(cls, crawler):
        return cls(
            tableName=crawler.settings.get('airtable_table'),
            match=crawler.settings.get('match')
        )

    def existsOnDb(self,item):   
        match_dict = {}
        for field in self.match:
            match_dict[field] = item[field]
        
        records_in_db = self.air_service.get_records_by_match(match_dict)
        return records_in_db is not None and len(records_in_db) > 0
        
    def process_item(self, item, spider):
        dictItem = ItemAdapter(item).asdict()
        self.air_service.set_table(self.tableName)
        
        if not self.existsOnDb(dictItem):
            self.air_service.create_record(item)
            
        return item