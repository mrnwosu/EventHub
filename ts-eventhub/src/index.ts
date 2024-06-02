import _ from "lodash";
import { VenueService } from "./services/venueService";
import { dumpObjectToFile } from "./utils/utils";


async function execute(){

    var eventData = await VenueService.GetEventDataForVenue("gorge-amphitheatre-events");

    eventData = _.sortBy(eventData, (event) => {
        return event.startDate;
    },);

    var searchResult = VenueService.SearchVenueByName("fillmore");

    console.log(searchResult);
    
    // dumpObjectToFile("gorge-amphitheatre-events", {
    //     data: eventData, 
    //     count: eventData.length,
    //     names: eventData.map((event) => event.name),
    //     dates: eventData.map((event) => event.startDate)
    //     se
    // });
}

execute().then(() => {
    console.log("done");
}).catch((error) => {
    console.log(error);
});