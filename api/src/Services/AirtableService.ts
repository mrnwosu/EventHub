import  airtable  from 'airtable'


export default class AirtableService{

    _apiKey = ""
    _baseID = ""
    
    constructor(apiKey: string, baseId: string) {
        this._apiKey = apiKey
        this._baseID = baseId        
    }
}