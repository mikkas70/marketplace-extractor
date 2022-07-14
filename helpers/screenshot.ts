import * as fs from "fs";
const sharp = require('sharp');
import { getRegion, encode } from 'screenshot-native';
import libnut from '@nut-tree/libnut';
import Jimp from "jimp";
import replaceColor from 'replace-color';

const getCroppedImage = (filename: string, startX: number, startY: number, endX: number, endY: number) => {
    const image = libnut.screen.capture(startX, startY, endX - startX, endY - startY);
    fs.writeFileSync(filename, encode(image, 'png'));

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
