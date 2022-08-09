import * as fs from "fs";
import { getRegion, encode } from 'screenshot-native';
import libnut from '@nut-tree/libnut';
import Jimp from "jimp";
import replaceColor from 'replace-color';
import screenshot from 'screenshot-desktop';
import sharp from 'sharp';

const getCroppedImage = (filename: string, startX: number, startY: number, endX: number, endY: number) => {
    const image = libnut.screen.capture(startX, startY, endX - startX, endY - startY);
    const tempFile = filename.replace('.png', '_.png');

    screenshot({format: 'png', filename: tempFile}).then((img) => {
        sharp(tempFile).extract({ width: endX - startX, height: endY - startY, left: startX, top: startY }).toFile(filename).then(function(new_file_info) {
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
        })
        .catch(function(err) {
            console.log("An error occured", err);
        });
    }).catch((err) => {
        console.log(err);
    })
}

export {
    getCroppedImage
}
