import {execSync} from "child_process";
import delay from "../helpers/delay";
import write from "../helpers/HumanWrite";
import {dragMouse, mouseClick, keyTap} from "@nut-tree/libnut";

export default class Tibia {
    private static instance: Tibia;

    public hasStarted: boolean = false;
    public isLoggedIn: boolean = false;
    public world: string;
    public items: string[] = [];

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
     * @param world
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

    public async logout() {
        keyTap('l', 'command');
        await delay(2000);
        await this.closeCharacterSelection();
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


    /**
     * Closes market
     * @return void
     */
    closeMarket = async () => {
        keyTap('escape');
    }

    /**
     * Close character selection screen
     * @return void
     */
    public closeCharacterSelection = async () => {
        keyTap('escape');
    }

    /**
     * Get world based on current mode.
     * @return string
     */
    public getWorld = (): string => {
        return process.env.SANDBOX_MODE === 'true' ? 'thyria' : this.world;
    }

    /**
     * Set items for this tibia instance
     * @param items
     * @return void
     */
    public setItems = (items: string[]): void => {
        this.items = items;
    }

    /**
     * Get items for this tibia instance
     * @return string[]
     */
    public getItems = (): string[] => {
        return this.items;
    }
}

