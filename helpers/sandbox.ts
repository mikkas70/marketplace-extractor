import delay from "./delay";
import {createWorker, OEM, PSM} from "tesseract.js";
import Market from "../Models/Market";

const sandbox = async () => {
    await delay(3000);

    //await new Market().startExtraction(); return;

    // Sandbox content
    //requiring path and fs modules
    const path = require('path');
    const fs = require('fs');
    //joining path of directory

    fs.readdir('images/thyria/', async (err, files) => {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }

        const worker = createWorker();
        await worker.load();
        await worker.loadLanguage('bos');
        await worker.initialize('bos');
        await worker.setParameters({
            tessedit_pageseg_mode: PSM.SINGLE_COLUMN,
            tessedit_char_whitelist: '0123456789.,k'
        });

        for await (const file of files) {
            console.log('---->' + file);
            var { data: { text } } = await worker.recognize('images/thyria/' + file);

            console.log(text);
        }

        await worker.terminate();
    });
};

export {
    sandbox
}

