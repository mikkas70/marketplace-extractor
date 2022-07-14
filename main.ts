import { execSync } from 'child_process';
import delay from "./helpers/delay";
import Tibia from "./Models/Tibia";
const robot = require('robotjs');
const screenshot = require('screenshot-desktop');
import 'dotenv/config';
import Market from "./Models/Market";
import CHARACTERS from "./constants/characters";
import {getCroppedImage} from "./helpers/screenshot";
import { createWorker, PSM, OEM, Worker, recognize } from 'tesseract.js';
import {sandbox} from "./helpers/sandbox";

robot.setMouseDelay(100);
robot.setKeyboardDelay(100);

//sandbox();

/*recognize('images/axe.png').then((data) => {
    console.log(data);
});*/

CHARACTERS.map(async (character) => {
    if (process.env.SANDBOX_MODE) {
        return sandbox();
    }


    // Initialize Tibia client
    const instance = await Tibia.getInstance();
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

    await market.startExtraction();
});
