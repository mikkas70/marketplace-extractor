import delay from "./delay";
import Market from "../models/Market";
import {IMarketStructure} from "../interfaces/marketStructure";
import CHARACTERS from "../constants/characters";
import Tibia from "../models/Tibia";
import textract from 'textract';
import APIService from "../services/APIService";

const sandbox = async () => {
    const service = new APIService();

    service.getMarketableItems().then((items) => {
        console.log(items);
    });
};

export {
    sandbox
}

