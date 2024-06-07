import fs from 'fs';
import chalk from 'chalk';
import inquirer from 'inquirer';

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

export async function confirmPrompt(message: string, defaultValue: boolean = false){
    const { confirm } = await inquirer.prompt({
        name: 'confirm',
        type: 'confirm',
        message,
        default: defaultValue
    })
    return confirm
}

export async function selectPrompt(message: string, choices: {name:string, value:string}[]){
    const { choice } = await inquirer.prompt({
        name: 'choice',
        type: 'list',
        message,
        choices
    })
    return choice
}

export async function inputPrompt(message: string, defaultValue: string = ""){
    const { input } = await inquirer.prompt({
        name: 'input',
        type: 'input',
        message,
        default: defaultValue
    })
    return (input as string).trim();
}

export async function passwordPrompt(message: string, defaultValue: string = ""){
    const { password } = await inquirer.prompt({
        name: 'password',
        type: 'password',
        message,
        default: defaultValue
    })
    return password
}

export function writeSuccess(...text: string[]){
    console.log(chalk.green(`${text} ✓`))
}

export function writeError(text: string){
    console.log(chalk.red(`${text} ✗`))
}

export function writeWarning(text: string){
    console.log(chalk.yellow(`${text} ⚠`))
}

export function writeInfo(text: string){
    console.log(chalk.blue(`${text} ℹ`))
}

export function writeDebug(text: string){
    console.log(chalk.gray(`${text} ℹ`))
}

export function debug(...text: string[]){
    console.log(chalk.gray(text))
}