# %%
import os
import json
from air import AirtableService
import datetime


def getEnvirOrDefault(key, default):
    return os.environ.get(key) if os.environ.get(key) else default

api_key = getEnvirOrDefault('AIRTABLE_API_KEY', "")
base_id = getEnvirOrDefault('AIRTABLE_BASE_ID', "apprHd6ejEpRJBUkt")
table_id = getEnvirOrDefault('AIRTABLE_BASE_NAME', "LiveNation")

air_service = AirtableService(api_key,base_id)
air_service.set_table(table_id)

# %%
jsonData = open('../data/output.json').read()
event_list = json.loads(jsonData)
event_list[0].keys()
# %%

def createEvent(event: dict):
    try:
        if not air_service.get_records_by_match({'title': event['title'], 'date': event['date']}):
            air_service.create_record(event)

    except Exception as e:
        print(f'ERROR - Unable to create event {e}: {event}')

for event in event_list:
    createEvent({
        'title':event['artist'],
        'genre':event['genre'],
        'date':event['date'],
        'ticket_url':event['ticket_url'],
        'image_url':event['image_url'],
        'venue_name':event['venue_name'],
        'location':event['location']
    })
# %%
