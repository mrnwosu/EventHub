import * as venues from "../../../data/venues-urls.json";
import _ from "lodash";
import { MusicEvent } from "../models/musicEventModels";
import cheerio from "cheerio";
import axios from "axios";

export class VenueService{
    public static getVenueUrl(filter: string){
        return _.first(_.filter(venues, (venue) => { 
            return venue.includes(filter); 
        }));  
    }

    public static getAllVenueUrls(){
        return venues; 
    }

    public static async getEventDataForVenue(filter: string){

        if(!filter){
            throw new Error("Venue filter is required");
        }

        const venueUrl = this.getVenueUrl(filter);

        if(!venueUrl){
            throw new Error("No venue found for filter");
        }

        const response = await axios.get(venueUrl);
        const $ = cheerio.load(response.data);
        
        let eventList: MusicEvent[] = [];

        $('script[type="application/ld+json"]').each((index, element) => {
            const parsedJson = JSON.parse($(element).html());
            if(parsedJson['@type'] === "MusicEvent"){
                eventList.push(parsedJson);
            }
        });

        return eventList;
    }
}