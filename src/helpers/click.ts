import {dragMouse, getScreenSize, mouseClick} from "@nut-tree/libnut";
import delay from './delay';

const drag = (x: number, y: number, delayMilliseconds: number = 50): void => {
    dragMouse(x, y);
}

const click = (x: number, y: number, delayMilliseconds: number = 50): void => {
    drag(x, y);

    if (delayMilliseconds) {
        delay(delayMilliseconds);
    }

    mouseClick();
}

export {
    drag,
    click
}
