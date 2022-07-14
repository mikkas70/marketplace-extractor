import {Rekognition} from "aws-sdk";
import * as fs from "fs";

export default class RekognitionService {
    private static instance: RekognitionService;
    private rekognition: Rekognition;

    constructor() {
       this.rekognition = new Rekognition({
           region: 'eu-west-1'
       });
    }

    public static getInstance() {
        if (!RekognitionService.instance) {
            RekognitionService.instance = new RekognitionService();
        }

        return RekognitionService.instance;
    }

    public getTextFromImage(imagePath: string) {
        return this.rekognition.detectText({
            Image: {
                Bytes: fs.readFileSync(imagePath)
            }
        }, (err, data) => {
            console.log(err);
            console.log(data);
        });
    }
}
