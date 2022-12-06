import ApiController from './Services/ApiController'

//Get someone configuration
const port = 8000

const controller = new ApiController(port)
controller.run()