from pyairtable import Api, Base, Table
from pyairtable.formulas import match
import json

class AirtableService:
    def __init__(self, api_key: str, base_id: str):
      self.api_key = api_key
      self.base_id = base_id
    
    def get_table(self, table_name: str) -> Table: 
        return Table(self.api_key, self.base_id, table_name)

    def get_all_records(self, table: str) -> list[dict]:
        return self.get_table(table).all()

    def get_record_by_id(self, table:str, record_id: str) -> dict:
        return self.get_table(table).get(record_id)

    def get_records_by_match(self, table, match_dict: dict) -> list[dict]:
        return self.get_table(table).all(formula=match(match_dict))

    # Deletes
    def delete_by_id(self, table: str, record_id: str):
        return self.get_table(table).delete(record_id)

    def delete_by_match(self, table: str, match: dict):
        records = self.get_records_by_match(table, match)
        ids = list(map(lambda r: r['id'], records))
        return self.get_table(table).batch_delete(ids)
        
    # Creates   
    def create_record(self, table: str, fields: dict):
        return self.get_table(table).create(fields)
    
    def update_record(self, table: str, record_id: str,  fields_to_update: dict, replace = False):
        return self.get_table(table).update(record_id,fields_to_update, replace)
