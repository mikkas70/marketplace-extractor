import delay from "./helpers/delay";
import Market from "./models/Market";
import {IMarketStructure} from "./interfaces/marketStructure";
import CHARACTERS from "./constants/characters";
import Tibia from "./models/Tibia";
import textract from 'textract';
import APIService from "./services/APIService";
import fs from "fs";

const API = new APIService();
const text = JSON.parse(fs.readFileSync('market_offers/thyria/1659646839701.json', 'utf-8'));

API.sendData('thyria', text).then((sentSuccessfully) => {
    if (sentSuccessfully) {
        console.log('Information sent successfully.');
    } else {
        console.log('Something went wrong sending information to the server');
    }
}).catch(err => {
    console.log(err);
    console.log('Something went wrong sending information to the server');
});
