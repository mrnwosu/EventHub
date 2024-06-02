# %%
import os
import json
from air import AirtableService


def getEnvirOrDefault(key):
    value = os.environ.get(key) 
    if value is None or len(value) == 0:
        raise Exception(f'No env variable set for {key}')

    return value
    

api_key = getEnvirOrDefault('AIRTABLE_API_KEY')
base_id = getEnvirOrDefault('AIRTABLE_BASE_ID')
table_id = 'tblGRJpr3dfyQQFU3'
air_service = AirtableService(api_key,base_id)



# %%
air_service.get_all_records('Venues')


# %%

def checkIfExistsOnDb(table: str, match: dict):
    result = air_service.get_records_by_match(table, match)
    return result is not None and len(result) > 0

# %%

json_text = open('../data/venue_cheat_code.json').read()
# %%

venueList = json.loads(json_text)

# %%

for venue in venueList:
    if not checkIfExistsOnDb("Venues", {'name': venue['name']}):
        print(f"Creating record for {venue}")
        air_service.create_record("Venues", venue)
    else:   
        print(f'Record already exists on db {venue["name"]}')
# %%
