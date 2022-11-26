import ApiController from './Services/ApiController'

//Get someone configuration
const port = 8000
const apiKey = process.env['AIRTABLE_API_KEY'] ?? "random"
const baseId = process.env['AIRTABLE_BASE_ID'] ?? 'apprHd6ejEpRJBUkt'


const controller = new ApiController(port, apiKey, baseId)
controller.startApi()

