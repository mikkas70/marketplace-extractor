import {dragMouse, mouseClick} from "@nut-tree/libnut";
import {getCroppedImage} from "../helpers/screenshot";
import delay from "../helpers/delay";
import ITEMS from "../constants/items";
import humanWrite from "../helpers/humanWrite";
import Tibia from "./Tibia";
import * as fs from "fs";

export default class Market {
    private currentItem: string;
    private offersPerItem: number = Number(process.env.MARKET_OFFERS_PER_ITEM);
    private offerPriceHeight: number = Number(process.env.MARKET_OFFER_PRICE_HEIGHT);
    private offerPriceWidth: number = Number(process.env.MARKET_OFFER_PRICE_WIDTH);

    /**
     * Extract item information from the marketplace
     * @return void
     */
    startExtraction = async () => {
        for (const itemName of ITEMS) {
            this.currentItem = itemName;

            await this.searchItem(itemName);
            await this.selectSearchedItem();

            this.printItem();

            await this.clearSearch();
        }
    }

    /**
     * Search item on the Market
     * @param itemName
     * @return void
     */
    private searchItem = async (itemName: string) => {
        dragMouse(Number(process.env.MARKET_SEARCH_COORDINATES_X), Number(process.env.MARKET_SEARCH_COORDINATES_Y));
        await delay(250);
        mouseClick();
        await delay(250);
        await humanWrite(itemName);
    }

    /**
     * Clear market search
     * @return void
     */
    private clearSearch = async () => {
        dragMouse(Number(process.env.MARKET_CLEAR_SEARCH_COORDINATES_X), Number(process.env.MARKET_CLEAR_SEARCH_COORDINATES_Y));
        await delay(250);
        mouseClick();
        await delay(250);
    }

    /**
     * Select searched item (always first position)
     * @return void
     */
    private selectSearchedItem = async () => {
        dragMouse(Number(process.env.MARKET_ITEM_POSITION_1_COORDINATES_X), Number(process.env.MARKET_ITEM_POSITION_1_COORDINATES_Y));
        await delay(250);
        mouseClick();
        await delay(1000);
    }

    private printItem = () => {
        /**
         * TODO - uncomment
         */
        //const world = Tibia.getInstance().world;
        const world = 'thyria';

        if (!fs.existsSync('images/' + world)) {
            fs.mkdir('images/' + world, (err) => {
                if (err) {
                    console.log('Could not create world folder.');
                }
            });
        }

        getCroppedImage(
            'images/' + world + '/' + this.currentItem + '.png',
            Number(process.env.MARKET_SELL_OFFERS_START_COORDINATES_X),
            Number(process.env.MARKET_SELL_OFFERS_START_COORDINATES_Y),
            Number(process.env.MARKET_SELL_OFFERS_END_COORDINATES_X),
            Number(process.env.MARKET_SELL_OFFERS_START_COORDINATES_Y) + (this.offersPerItem * this.offerPriceHeight)
        )
    }
}
