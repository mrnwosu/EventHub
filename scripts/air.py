from pyairtable import Api, Base, Table
from pyairtable.formulas import match

class AirtableService:
    def __init__(self, api_key: str, base_id: str):
      self.api_key = api_key
      self.base_id = base_id
    

    def set_table(self, table_name: str) -> Table: 
        self.table = Table(self.api_key, self.base_id, table_name)

    # Gets 
    def get_all_records(self) -> list[dict]:
        return self.table.all()

    def get_record_by_id(self, record_id: str) -> dict:
        return self.table.get(record_id)

    def get_records_by_name(self, record_name: str) -> list[dict]:
        return self.get_records_by_match({'name': record_name})

    def get_records_by_match(self, match_dict: dict) -> list[dict]:
        return self.table.all(formula=match(match_dict))

    # Deletes
    def delete_by_id(self, record_id: str):
        return self.table.delete(record_id)

    def delete_by_match(self, match: dict):
        records = self.get_records_by_match(match)
        ids = list(map(lambda r: r['id'], records))
        return self.table.batch_delete(ids)
        
    # Creates   
    def create_record(self, fields: dict):
        return self.table.create(fields)
    
    def update_record(self, record_id: str,  fields_to_update: dict, replace = False):
        return self.table.update(record_id,fields_to_update, replace)
