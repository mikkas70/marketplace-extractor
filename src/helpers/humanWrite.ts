import delay from "./delay";
import generateRandomInteger from "./randomizer";
import { typeString, keyTap } from "@nut-tree/libnut";

const write = async (phrase: string) => {
    for (var i = 0; i < phrase.length; i++) {
        typeString(phrase.charAt(i));
        /*const specialCharacterIndex = SPECIAL_CHARACTERS.indexOf(phrase[i]);

        if (process.platform === "linux" && specialCharacterIndex !== -1) {
            keyTap(phrase[i], ['shift']);
        } else {

        }*/

        await delay(generateRandomInteger(10, 20));
    }
}

export default write;
