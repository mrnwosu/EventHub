import _ from "lodash";
import { VenueService } from "./services/venueService";
import { dumpObjectToFile } from "./utils/utils";


async function execute(){

    var eventData = await VenueService.getEventDataForVenue("silver-spring");

    eventData = _.sortBy(eventData, (event) => {
        return event.startDate;
    },);
    
    dumpObjectToFile("event-data-for-silver-spring", {
        data: eventData, 
        count: eventData.length,
        names: eventData.map((event) => event.name),
        dates: eventData.map((event) => event.startDate)
    });

}

execute().then(() => {
    console.log("done");
}).catch((error) => {
    console.log(error);
});