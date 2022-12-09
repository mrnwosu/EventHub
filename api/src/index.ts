import ApiController from './Services/ApiController'

//Get someone configuration
const port = process.env['EVENTHUB_PORT'] ?? "80"
const controller = new ApiController(port)
controller.run()