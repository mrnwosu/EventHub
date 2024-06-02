import fs from 'fs';

export async function dumpObjectToFile(fileName: string, object: any){
    console.log("Dumping content to file");

    if(!fs.existsSync("./dump")){
        fs.mkdirSync("./dump");
    }

    const content = JSON.stringify(object, null, 2);   

    fs.writeFile(`./dump/${fileName}-dump`, content, function(err) {
        if(err) {
            return console.log(err);
        }
    
        console.log("The file was saved!");
    });
}