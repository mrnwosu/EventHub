import express from 'express'

export default class ApiController {
    _apiKey: string
    _baseId: string
    _port: number
        
    EVENT_TABLE_NAME = 'Events'
    VENUES_TABLE_NAME = 'Venues'

    constructor(port, apiKey, baseId) {
        this._port = port
        this._apiKey = apiKey
        this._baseId = baseId
    }

    startApi(){
        const app = express()
        app.get('/venues', (req, res) => {
            res.send(`This is ${req.path}`)
        })
        
        app.get('/events', (req, res) => {
            res.send(`This is ${req.path}`)
        })
        
        app.listen(this._port,()=>{
            console.log(`Currently listening on ${this._port}.`)
        })    
    }
}