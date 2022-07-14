import {execSync} from "child_process";
import { keyTap } from "robotjs";
import delay from "../helpers/delay";
import write from "../helpers/HumanWrite";
import {dragMouse, mouseClick} from "@nut-tree/libnut";

export default class Tibia {
    private static instance: Tibia;

    public world: string;
    public hasStarted: boolean = false;
    public isLoggedIn: boolean = false;

    constructor() {
        try {
            execSync('open -a Tibia.app');
            this.hasStarted = true;
        } catch (e) {
            console.log('Something went wrong while initializing Tibia application');
        }
    }

    public static getInstance(): Tibia {
        if (!Tibia.instance) {
            Tibia.instance = new Tibia();
        }

        return Tibia.instance;
    }

    /**
     * Login to Tibia character
     * @param username
     * @param password
     */
    public async login(username, password, world) {
        await write(username);
        await delay(1000);
        keyTap('tab');
        await write(password);
        keyTap('enter');
        await delay(1000);
        keyTap('down');
        await delay(1000);
        keyTap('enter');
        this.hasStarted = true;
        this.world = world;
    }

    public logout() {
        keyTap('l', 'command');
        this.isLoggedIn = false;
        this.world = null;
    }

    /**
     * Open character stash (needs to be on north tile)
     * @return void
     */
    public openStash = () => {
        dragMouse(Number(process.env.STASH_COORDINATES_X), Number(process.env.STASH_COORDINATES_Y));
        mouseClick();
    };

    /**
     * Opens market (needs to have stash opened)
     * @return void
     */
    public openMarket = () => {
        dragMouse(Number(process.env.MARKET_COORDINATES_X), Number(process.env.MARKET_COORDINATES_Y));
        mouseClick();
    };
}

