import {Rekognition} from "aws-sdk";
import * as fs from "fs";

class RekognitionService {
    private static instance: RekognitionService;
    private rekognition: Rekognition;

    constructor() {
       this.rekognition = new Rekognition();
    }

    public getInstance() {
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
            console.log(data);
        });
    }
}
