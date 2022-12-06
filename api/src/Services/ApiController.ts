import express from 'express'
import EventHubService from './EventhubService'

export default class ApiController {
    _port: number
    _eventHubService: EventHubService

    constructor(port,) {
        this._port = port
        this._eventHubService = new EventHubService()
    }

    run(){
        const app = express()

        // Venues
        app.get('/venues/:venueId', async (req, res)=>{
            const result = await this._eventHubService.getVenue(req.params.venueId)           
            res.json(result)
        })

        app.get('/venues', async (req, res) => {
            try {
                const filter = req.query.filter ?  JSON.parse( req.query.filter as string) : null
                const result = await this._eventHubService.getFilteredVenues(filter)
                res.json(result)
                
            } catch (error) {
                res.send(`FAIL ${error}`)//Make Bad Request Object
            }
        })
        

        //Events
        app.get('/events', async (req, res) => {
            try {
                const filter = req.query.filter ?  JSON.parse( req.query.filter as string) : null
                const result = await this._eventHubService.getFilteredEvents(filter)
                res.json(result)
            } catch (error) {
                res.send(`FAIL ${error}`)
            }
        })

        app.get('/event/:eventId', async (req, res)=>{
            const result = await this._eventHubService.getEvent(req.params.eventId)           
            res.json(result)
        })
        
        app.listen(this._port,()=>{
            console.log(`Currently listening on ${this._port}.`)
        })    
    }
}