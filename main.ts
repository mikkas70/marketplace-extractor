import { execSync } from 'child_process';
import delay from "./helpers/delay";
import Tibia from "./models/Tibia";
const robot = require('robotjs');
const screenshot = require('screenshot-desktop');
import 'dotenv/config';
import Market from "./models/Market";
import CHARACTERS from "./constants/characters";
import {getCroppedImage} from "./helpers/screenshot";
import {sandbox} from "./helpers/sandbox";
import APIService from "./services/APIService";

robot.setMouseDelay(100);
robot.setKeyboardDelay(100);

const logic = async () => {
    const API = new APIService();

    let items: string[] = [];

    await API.getMarketableItems().then((itemsResponse) => {
        items = itemsResponse;
    });


    for await (const character of CHARACTERS) {
        // Initialize Tibia client
        const instance = await Tibia.getInstance();
        instance.setItems(items);

        await delay(5000);

        // Login character
        await instance.login(character.username, character.password, character.world);
        await delay(1500);

        // Open character stash
        instance.openStash();
        await delay(1500);

        // Open character market
        instance.openMarket();
        await delay(1500);

        const market = new Market();
        await delay(1500);

        await market.startExtraction().then(async () => {
            await instance.closeMarket();
        });

        await market.parseMarketData().then(data => {
            market.saveMarketData(data).then(() => {
                API.sendData(instance.getWorld(), data).then((sentSuccessfully) => {
                    console.log('Information sent successfully.');
                }).catch(err => {
                    console.log('Something went wrong sending information to the server');
                });
            });
        });

        await instance.logout();
    }
}

if (process.env.SANDBOX_MODE === 'true') {
    sandbox();
} else {
    logic();
}
