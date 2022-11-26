import AirtableService from './AirtableService'

export default class EventhubService{
    _airtableService: AirtableService
    EVENT_TABLE_NAME = 'Events'
    VENUES_TABLE_NAME = 'Venues'

    constructor() {
        const apiKey = process.env['AIRTABLE_API_KEY'] ?? "random"
        const baseId = process.env['AIRTABLE_BASE_ID'] ?? 'apprHd6ejEpRJBUkt'    
        this._airtableService = new AirtableService(apiKey, baseId)
    }

    async getEventByRecord(recordId){
        return await this._airtableService.getRecordById(this.EVENT_TABLE_NAME, recordId)
    }
}