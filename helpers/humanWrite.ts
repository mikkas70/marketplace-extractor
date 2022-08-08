import delay from "./delay";
import generateRandomInteger from "./randomizer";
import { typeString } from "@nut-tree/libnut";

const write = async (phrase: string) => {
    for (var i = 0; i < phrase.length; i++) {
        typeString(phrase.charAt(i));
        await delay(generateRandomInteger(10, 20));
    }
}

export default write;
