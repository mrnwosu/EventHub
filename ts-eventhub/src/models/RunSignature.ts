import { VenueData } from "./venueData";


export class RunSignature {
  searchByName: boolean;
  searchByZipcode: boolean;
  venueSearchTerm: string;
  selectedVenue: VenueData;
  collectAllEvents: boolean;
  collectEventsByName: boolean;
  eventSearchTerm: string;
}
