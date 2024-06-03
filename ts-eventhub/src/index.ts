import _ from "lodash";
import { VenueService } from "./services/venueService";
import {
  confirmPrompt,
  inputPrompt,
  selectPrompt,
  writeError,
  writeInfo,
} from "./utils/utils";
import { VenueData } from "./models/venueData";

interface RunSignature {
  searchByName: boolean;
  searchByZipcode: boolean;
  venueSearchTerm: string;
  selectedVenue: VenueData;
  collectAllEvents: boolean;
  collectEventsByName: boolean;
  eventSearchTerm: string;
}

async function execute() {
  let signature: RunSignature;

  const searchResponse = await selectPrompt(
    "How would you like to select your Venue",
    [
      { name: "Search by name", value: "searchByName" },
      { name: "Search by zipcode", value: "searchByZipcode" },
    ]
  );

  signature.searchByName = searchResponse === "searchByName";
  signature.searchByZipcode = searchResponse === "searchByZipcode";

  const searchPrompt = signature.searchByName
    ? "Enter the name of the venue"
    : "Enter the zipcode of the venue";
  signature.venueSearchTerm = await inputPrompt(searchPrompt);

  let venueResults: VenueData[] = [];

  if (signature.searchByName) {
    venueResults.push(
      ...VenueService.GetVenuesDataByName(signature.venueSearchTerm)
    );
    console.log(venueResults);
  } else {
    venueResults.push(
      ...VenueService.GetVenuesDataByZipcode(signature.venueSearchTerm)
    );
    console.log(venueResults);
  }

  const selectedVenue = await selectPrompt(
    "Select a venue",
    venueResults.map((venue: VenueData) => {
      return { name: venue.name, value: venue.id };
    })
  );

  signature.selectedVenue = VenueService.GetVenueDataById(selectedVenue);

  const collectEventResponse = await selectPrompt(
    "How would you like to collect events for this venue?",
    [
      { name: "Collect all events", value: "collectAllEvents" },
      { name: "Collect events by name", value: "collectEventsByName" },
    ]
  );

  signature.collectAllEvents = collectEventResponse === "collectAllEvents";
  signature.collectEventsByName =
    collectEventResponse === "collectEventsByName";

  if (signature.collectEventsByName) {
    signature.eventSearchTerm = await inputPrompt(
      "Enter the name of the event"
    );
  }

  const events = signature.collectAllEvents
    ? await VenueService.GetAllEventDataForVenue(signature.selectedVenue)
    : await VenueService.GetEventDataForVenueByName(
        signature.selectedVenue.name
      );

  writeInfo(`Collected ${events ? events.length : 0} events`);
  if (!events) {
    writeError("No events found. Exiting");
    return;
  }

}

execute()
  .then(() => {
    console.log("done");
  })
  .catch((error) => {
    console.log(error);
  });
