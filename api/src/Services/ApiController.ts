import express from 'express'
import EventHubService from './EventhubService'

export default class ApiController {
    _port: number
    _eventHubService: EventHubService

    constructor(port,) {
        this._port = port
        this._eventHubService = new EventHubService()
    }

    startApi(){
        const app = express()
        app.get('/venues', (req, res) => {
            res.send(`This is ${req.path}`)
        })
        
        app.get('/events', async (req, res) => {
            console.log('Events request recieved')
            var result = await this._eventHubService.getEventByRecord('rechfEeK6kcd9Eqdq')
            console.log(result)
            
            res.send(`This is ${req.path} ${JSON.stringify(result)}`)
        })
        
        app.get('/events/{recordId}', async (req, res) => {
            var result = await this._eventHubService.getEventByRecord(req.query['recordId'])
            res.send(`This is ${req.path} ${result}`)
        })
        
        app.listen(this._port,()=>{
            console.log(`Currently listening on ${this._port}.`)
        })    
    }
}