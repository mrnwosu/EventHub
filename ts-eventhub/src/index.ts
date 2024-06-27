import _ from "lodash";
import { VenueService } from "./services/venueService";
import {
  confirmPrompt,
  inputPrompt,
  selectPrompt,
  writeError,
  writeInfo,
  writeWarning,
} from "./utils/utils";
import { VenueData } from "./models/venueData";
import { RunSignature } from "./models/RunSignature";
import { DataService } from "./services/configurationService";

async function execute() {
  const dataService = new DataService();

  const lastRun = await dataService.getLastRun();
  if (lastRun) {
    writeInfo(`Last run: ${lastRun.lastRun}`);
  }
  else {
    writeWarning("No previous runs found. Starting new run");
    dataService.initRun();
  }

  await dataService.startRun();
  const accessToken = await dataService.getAccessToken();

  if (!accessToken) {
    writeWarning(
      "No access token found. You will need to authenticate first. In order to add events to your calendar."
    );
  }

  let signature = new RunSignature();
  await selectVenue(signature, lastRun, dataService);
  await dataService.setPreviousSelectedVenue(signature.selectedVenue.id);

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

// Move to app service
async function selectVenue(
  signature: RunSignature,
  lastRun: any,
  dataService: DataService
) {

  if (lastRun?.previousSelectedVenue) {
    var previous = VenueService.GetVenueDataById(lastRun.previousSelectedVenue);
    const usePreviousConfirm = await confirmPrompt(
      `Would you like to use \"${previous.name}\"`
    );

    if (usePreviousConfirm) {
      signature.selectedVenue = previous;
      writeInfo(
        `Using previous selected venue: ${previous.name}`
      );
      return;
    }

    const clearPreviousConfirm = await confirmPrompt(
      "Would you like to clear the previous selected venue?"
    );

    if (clearPreviousConfirm) {
      dataService.clearPreviousSelectedVenue();
    }
  } else {
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
    writeInfo(`Selected venue: ${JSON.stringify(signature.selectedVenue)}`);
  }
}

execute()
  .then(() => {
    console.log("done");
  })
  .catch((error) => {
    console.log(error);
  });
