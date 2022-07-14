import delay from "./delay";
import Market from "../models/Market";
import {IMarketStructure} from "../interfaces/marketStructure";
import CHARACTERS from "../constants/characters";
import Tibia from "../models/Tibia";
import textract from 'textract';

const sandbox = async () => {
    await delay(3000);

    textract.fromFileWithPath('images/thyria/__BUY__/Soulbleeder.png', (error, text) => {
        console.log(error);
        console.log(text);
    });
    const b = 1;
};

export {
    sandbox
}

