import * as venueData from "../../../data/venue-data.json";
import _ from "lodash";
import { MusicEvent } from "../models/musicEventModels";
import cheerio from "cheerio";
import axios from "axios";
import { VenueData } from "../models/venueData";

export class VenueService{
    public static getVenueUrl(filter: string){
        return _.first(_.filter(venueData, (venue: VenueData) => { 
            if(venue.url){
                return venue.url.includes(filter); 
            }
        }));  
    }

    public static getAllVenues(): VenueData[]{
        return venueData; 
    }

    public static GetVenueDataById(id: string){
        return _.first(_.filter(venueData, (venue: VenueData) => { 
            if(venue.id){
                if(venue.id){
                    return venue.id === id; 
                }
            }
        }));  
    }

    public static GetVenueDataByName(name: string){
        return _.first(_.filter(venueData, (venue: VenueData) => { 
            if(venue.name){
                return venue.name.toLowerCase().includes(name.toLowerCase()); 
            }
        }));
    }

    public static GetVenueDataByZipcode(name: string){
        return _.first(_.filter(venueData, (venue: VenueData) => { 
            if(venue.zipcode){
                return venue.zipcode === name; 
            }
        }));
    }

    public static GetEventDataForVenueById(venueId: string){
        const venueData = this.GetVenueDataById(venueId);
        return this.GetEventDataForVenue(venueData);
    }

    public static GetEventDataForVenueByName(venueName: string){
        const venueData = this.GetVenueDataByName(venueName);
        return this.GetEventDataForVenue(venueData);
    }

    public static GetEventDataForVenueByZipcode(zipcode: string){
        const venueData = this.GetVenueDataByZipcode(zipcode);
        return this.GetEventDataForVenue(venueData);
    }
s
    public static async GetEventDataForVenue(venueData: VenueData){
        const response = await axios.get(venueData.url);
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

    public static SearchVenueByName(name: string){
        return _.filter(venueData, (venue: VenueData) => {
            if(venue.name){
                return venue.name.toLowerCase().includes(name.toLowerCase());
            }
        });
    }

}