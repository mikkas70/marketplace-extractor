import {dragMouse, mouseClick, keyTap} from "@nut-tree/libnut";
import {getCroppedImage} from "../helpers/screenshot";
import delay from "../helpers/delay";
import humanWrite from "../helpers/humanWrite";
import Tibia from "./Tibia";
import * as fs from "fs";
import {IMarketStructure} from "../interfaces/marketStructure";
import {sanitizePrice} from "../helpers/price";
import rmdir from 'rimraf';
import {ensureDirectoryExists} from "../helpers/filesystem";
import FOLDERS from "../constants/folders";
import textract from 'textract';
import APIService from "../services/APIService";
import moment from "moment";
import {click} from "../helpers/click";

export default class Market {
    private timestamp: moment.Moment;
    private currentItemIndex: number = 0;
    private hasFinishedParsing = false;
    private offersPerItem: number = Number(process.env.MARKET_OFFERS_PER_ITEM);
    private offerPriceHeight: number = Number(process.env.MARKET_OFFER_PRICE_HEIGHT);
    private offerPriceWidth: number = Number(process.env.MARKET_OFFER_PRICE_WIDTH);
    private API = new APIService();

    constructor() {
        const world = Tibia.getInstance().getWorld();

        this.timestamp = moment();

        ensureDirectoryExists(process.env.IMAGES_FOLDER + '/' + world + '/' + FOLDERS.MARKET_OFFER_BUYING + '/' + FOLDERS.MARKET_OFFER_PRICES);
        ensureDirectoryExists(process.env.IMAGES_FOLDER + '/' + world + '/' + FOLDERS.MARKET_OFFER_BUYING + '/' + FOLDERS.MARKET_OFFER_QUANTITY);

        ensureDirectoryExists(process.env.IMAGES_FOLDER + '/' + world + '/' + FOLDERS.MARKET_OFFER_SELLING + '/' + FOLDERS.MARKET_OFFER_PRICES);
        ensureDirectoryExists(process.env.IMAGES_FOLDER + '/' + world + '/' + FOLDERS.MARKET_OFFER_SELLING + '/' + FOLDERS.MARKET_OFFER_QUANTITY);

        ensureDirectoryExists(process.env.MARKET_OFFERS_JSON_FOLDER + '/' + world);
    }

    /**
     * Extract item information from the marketplace
     * @return void
     */
    startExtraction = async () => {
        const start = performance.now();
        const items = Tibia.getInstance().getItems();

        for (const itemName of items) {
            const index = items.indexOf(itemName);

            await this.searchItem(itemName);
            await this.selectSearchedItem();

            this.getSellOffersImage(index);
            this.getSellOfferQuantities(index);

            this.getBuyOffersImage(index);
            this.getBuyOfferQuantities(index);

            await this.clearSearch();
        }

        console.log('Finished processing ' + Tibia.getInstance().items.length + ' items in ' + ((performance.now() - start) / 1000) + ' seconds');
    }

    /**
     * Parse all market data and return parsed data.
     * @return Promise<IMarketStructure>
     */
    parseMarketData = async (): Promise<IMarketStructure> => {
        const world = Tibia.getInstance().getWorld();
        const items = Tibia.getInstance().getItems();
        const data: IMarketStructure = {
            date: this.timestamp.format('D-M-YYYY'),
            offers: [],
        };

        for (const itemName of items.values()) {
            const itemIndex = items.indexOf(itemName);

            if (!fs.existsSync('images/' + world + '/' + FOLDERS.MARKET_OFFER_BUYING + '/' + FOLDERS.MARKET_OFFER_PRICES + '/' + itemIndex + '.png') ||
                !fs.existsSync('images/' + world + '/' + FOLDERS.MARKET_OFFER_SELLING + '/' + FOLDERS.MARKET_OFFER_PRICES + '/' + itemIndex + '.png')) {
                continue;
            }

            textract.fromFileWithPath('images/' + world + '/' + FOLDERS.MARKET_OFFER_BUYING + '/' + FOLDERS.MARKET_OFFER_PRICES + '/' + itemIndex + '.png', (buyingPricesError, buyingPrices) => {
                textract.fromFileWithPath('images/' + world + '/' + FOLDERS.MARKET_OFFER_SELLING + '/' + FOLDERS.MARKET_OFFER_PRICES + '/' + itemIndex + '.png', (sellingPricesError, sellingPrices) => {
                    textract.fromFileWithPath('images/' + world + '/' + FOLDERS.MARKET_OFFER_BUYING + '/' + FOLDERS.MARKET_OFFER_QUANTITY + '/' + itemIndex + '.png', (buyingQuantitiesError, buyingQuantities) => {
                        textract.fromFileWithPath('images/' + world + '/' + FOLDERS.MARKET_OFFER_SELLING + '/' + FOLDERS.MARKET_OFFER_QUANTITY + '/' + itemIndex + '.png', (sellingQuantitiesError, sellingQuantities) => {
                            const buying = buyingPrices.split(' ');
                            const buyingQuantity = buyingQuantities.split(' ').reduce((a,b) => Number(a) + Number(b), 0) || 0;

                            const selling = sellingPrices.split(' ');
                            const sellingQuantity = sellingQuantities.split(' ').reduce((a,b) => Number(a) + Number(b), 0) || 0;

                            const buyOffers = buying.map((price): number | undefined => sanitizePrice(price)).filter((price) => price !== undefined);
                            const sellOffers = selling.map((price): number | undefined => sanitizePrice(price)).filter((price) => price !== undefined);

                            data.offers.push({
                                itemName: itemName,
                                buyQuantity: buyingQuantity,
                                sellQuantity: sellingQuantity,
                                buyOffers: buyOffers,
                                sellOffers: sellOffers
                            });

                            if (itemIndex + 1 === items.length) {
                                this.hasFinishedParsing = true;
                            }
                        });
                    });
                });
            });
        }

        while (!this.hasFinishedParsing) {
            await delay(200);
        }

        this.cleanup();

        return Promise.resolve(data);
    }

    /**
     * Save all market data into a JSON file.
     * @param data
     * @return Promise<boolean>
     */
    saveMarketData = (data: IMarketStructure): Promise<boolean> => {
        const world = Tibia.getInstance().getWorld();

        fs.writeFile(process.env.MARKET_OFFERS_JSON_FOLDER + '/' + world + '/' + this.timestamp + '.json', JSON.stringify(data),(err) => {
            if (err) {
                console.log('Could not save market offers', err);
            }
        });

        return Promise.resolve(true);
    }

    /**
     * Clean everything that is not needed.
     * @return void
     */
    cleanup = () => {
        const world = Tibia.getInstance().getWorld();

        /*rmdir(process.env.IMAGES_FOLDER + '/' + world, err => {
            if (err) {
                console.log('Something went wrong deleting the images folder during cleanup.');
            }
        });*/
    }

    private getTransactionType = (path: string) => {
        if (path.indexOf(FOLDERS.MARKET_OFFER_BUYING)) return FOLDERS.MARKET_OFFER_BUYING;
    }

    /**
     * Search item on the Market
     * @param itemName
     * @return void
     */
    private searchItem = async (itemName: string) => {
        click(Number(process.env.MARKET_SEARCH_COORDINATES_X), Number(process.env.MARKET_SEARCH_COORDINATES_Y));
        await delay(50);
        await humanWrite(itemName);
    }

    /**
     * Clear market search
     * @return void
     */
    private clearSearch = async () => {
        click(Number(process.env.MARKET_CLEAR_SEARCH_COORDINATES_X), Number(process.env.MARKET_CLEAR_SEARCH_COORDINATES_Y));
        await delay(50);
    }

    /**
     * Select searched item (always first position)
     * @return void
     */
    private selectSearchedItem = async () => {
        click(Number(process.env.MARKET_ITEM_POSITION_1_COORDINATES_X), Number(process.env.MARKET_ITEM_POSITION_1_COORDINATES_Y));
        await delay(175);
    }

    private getSellOffersImage = (index: number) => {
        getCroppedImage(
            'images/' + Tibia.getInstance().getWorld() + '/' + FOLDERS.MARKET_OFFER_SELLING + '/' + FOLDERS.MARKET_OFFER_PRICES + '/' + index + '.png',
            Number(process.env.MARKET_SELL_OFFERS_START_COORDINATES_X),
            Number(process.env.MARKET_SELL_OFFERS_START_COORDINATES_Y),
            Number(process.env.MARKET_SELL_OFFERS_START_COORDINATES_X) + this.offerPriceWidth,
            Number(process.env.MARKET_SELL_OFFERS_START_COORDINATES_Y) + (this.offersPerItem * this.offerPriceHeight)
        );
    }

    private getSellOfferQuantities = (index: number) => {
        getCroppedImage(
            'images/' + Tibia.getInstance().getWorld() + '/' + FOLDERS.MARKET_OFFER_SELLING + '/' + FOLDERS.MARKET_OFFER_QUANTITY + '/' + index + '.png',
            Number(process.env.MARKET_SELL_OFFERS_START_COORDINATES_X) - Number(process.env.MARKET_OFFER_QUANTITY_WIDTH),
            Number(process.env.MARKET_SELL_OFFERS_START_COORDINATES_Y),
            Number(process.env.MARKET_SELL_OFFERS_START_COORDINATES_X),
            Number(process.env.MARKET_SELL_OFFERS_START_COORDINATES_Y) + (this.offersPerItem * this.offerPriceHeight)
        );
    }

    private getBuyOffersImage = (index: number) => {
        getCroppedImage(
            'images/' + Tibia.getInstance().getWorld() + '/' + FOLDERS.MARKET_OFFER_BUYING + '/' + FOLDERS.MARKET_OFFER_PRICES + '/' + index + '.png',
            Number(process.env.MARKET_BUY_OFFERS_START_COORDINATES_X),
            Number(process.env.MARKET_BUY_OFFERS_START_COORDINATES_Y),
            Number(process.env.MARKET_BUY_OFFERS_START_COORDINATES_X) + this.offerPriceWidth,
            Number(process.env.MARKET_BUY_OFFERS_START_COORDINATES_Y) + (this.offersPerItem * this.offerPriceHeight)
        );
    }

    private getBuyOfferQuantities = (index: number) => {
        getCroppedImage(
            'images/' + Tibia.getInstance().getWorld() + '/' + FOLDERS.MARKET_OFFER_BUYING + '/' + FOLDERS.MARKET_OFFER_QUANTITY + '/' + index + '.png',
            Number(process.env.MARKET_BUY_OFFERS_START_COORDINATES_X) - Number(process.env.MARKET_OFFER_QUANTITY_WIDTH),
            Number(process.env.MARKET_BUY_OFFERS_START_COORDINATES_Y),
            Number(process.env.MARKET_BUY_OFFERS_START_COORDINATES_X),
            Number(process.env.MARKET_BUY_OFFERS_START_COORDINATES_Y) + (this.offersPerItem * this.offerPriceHeight)
        );
    }
}
