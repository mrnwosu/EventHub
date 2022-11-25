from pyairtable import Api, Base, Table
import os


api = Api(os.environ['AIRTABLE_API_KEY'])
api.get_base('apprHd6ejEpRJBUkt')