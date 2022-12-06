import { EventModel, VenueModel } from './../Models/EventModel';
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

    // async getAllEvents(){
    //     return await this._airtableService.getRecordsList(this.EVENT_TABLE_NAME)
    // }

    // async getAllVenues(){
    //     return await this._airtableService.getRecordsList(this.EVENT_TABLE_NAME)
    // }

    async getEvent(recordId: string){
        return await this._airtableService.getRecordById(this.EVENT_TABLE_NAME, recordId)
    }

    
    async getVenue(recordId: string){
        return await this._airtableService.getRecordById(this.VENUES_TABLE_NAME, recordId)
    }

    async getFilteredEvents(filter){
        const result = await this._airtableService.getRecordsByFields(this.EVENT_TABLE_NAME, filter)
        return result.map(m => (this.convertEvent(m.fields))) 
    }

    async getFilteredVenues(filter){
        const result = await this._airtableService.getRecordsByFields(this.VENUES_TABLE_NAME, filter)
        return result.map(m => (this.convertVenue(m.fields))) 
    }

    convertEvent(record): EventModel{
        return {
            id: record['id'],
            title: record['title'],
            ticket_url: record['ticket_url'],
            date: record['date'],
            genre: record['genre'],
            image_url: record['image_url'],
            venue_name: record['name (from venue)'][0],
            venue_state: record['state (from venue)'][0],
            venue_city: record['city (from venue)'][0],
            venue_url: record['venue_url (from venue)'][0],
        }
    }

    convertVenue(record): VenueModel{
        return {
            id: record['id'],
            name: record['name'],
            city: record['city'],
            state: record['state'],
            address: record['address'],
            venue_url: record['venue_url'],
            image_url: record['image_url'],
        }
    }
}