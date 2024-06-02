import axios from "axios";
import * as venues from "../../data/venues-urls.json";
import _ from "lodash";
import fs from "fs";
import cheerio from "cheerio";



async function execute(){

    const fillmoreURl = await getVenueUrl();
    var response = await axios.get(fillmoreURl);

    dumpContentToFile("filemoreData.html", response.data);
    const $ = cheerio.load(response.data);

    let eventList = [];

    $('script[type="application/ld+json"]').each((index, element) => {
        const json = JSON.parse($(element).html());
        if(json['@type'] === "MusicEvent"){
            eventList.push(json);
        }
    });

    dumpContentToFile("filemoreEvents.json", JSON.stringify(eventList, null, 2));
    dumpContentToFile("filemoreEventNames", JSON.stringify(eventList.map(s => s.name), null, 2));
}

async function getVenueUrl(filter= "fillmore-silver-spring" ){
    const fillmoreURl = _.filter(venues, (venue) => { 
        return venue.includes(filter); 
    })[0];

    return fillmoreURl;
}

async function dumpContentToFile(fileName: string, content: string){
    console.log("Dumping content to file");

    if(!fs.existsSync("./dump")){
        fs.mkdirSync("./dump");
    }

    fs.writeFile(`./dump/${fileName}-dump`, content, function(err) {
        if(err) {
            return console.log(err);
        }
    
        console.log("The file was saved!");
    });
}


execute().then(() => {
    console.log("done");
}).catch((error) => {
    console.log(error);
});