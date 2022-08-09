import delay from "./delay";
import generateRandomInteger from "./randomizer";
import { typeString, keyTap } from "@nut-tree/libnut";
const SPECIAL_CHARACTERS = [
    '~',
    '!',
    '@',
    '#',
    '$',
    '%',
    '^',
    '&',
    '*',
    '(',
    ')',
    '_',
    '+',
    '{',
    '}',
    '|',
    ':',
    '"',
    '<',
    '>',
    '?'
];

const write = async (phrase: string) => {
    for (var i = 0; i < phrase.length; i++) {
        const specialCharacterIndex = SPECIAL_CHARACTERS.indexOf(phrase[i]);

        if (process.platform === "linux" && specialCharacterIndex !== -1) {
            keyTap(phrase[i], ['shift']);
        } else {
            typeString(phrase.charAt(i));
        }

        await delay(generateRandomInteger(10, 20));
    }
}

export default write;
