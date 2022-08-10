import * as fs from "fs";
import { getRegion, encode } from 'screenshot-native';
import libnut from '@nut-tree/libnut';
import Jimp from "jimp";
import replaceColor from 'replace-color';
import {execSync} from "child_process";

const getCroppedImage = (filename: string, startX: number, startY: number, endX: number, endY: number) => {
    if (process.platform === "darwin") {
        const image = libnut.screen.capture(startX, startY, endX - startX, endY - startY);
        fs.writeFileSync(filename, encode(image, 'png'));
    } else {
        const crop = `${startX}x${startY}+${endX - startX}+${endY - startY}`;
        execSync('import -silent -window root -crop ' + crop + ' -screen ' + filename);
    }

    replaceColor({
        image: filename,
        colors: {
            type: 'hex',
            targetColor: '#1111B0',
            replaceColor: '#FFFFFF'
        }
    }, (err, jimpObject) => {
        jimpObject.greyscale().contrast(1).write(filename, (err) => {
            if (err) return console.log(err)
        })
    });
}

export {
    getCroppedImage
}
