import ITEMS from "../constants/items";
import {IMarketStructure} from "../interfaces/marketStructure";

export default class APIService {
    /**
     * Get market searcheable items. Returns an array of item names.
     * @return Promise<string[]>
     */
    getMarketableItems = (): Promise<string[]> => {
        return Promise.resolve(ITEMS);
    };

    /**
     * Send data information to the server.
     * @param data
     */
    sendData = (data: IMarketStructure): Promise<boolean> => {
        console.log('Sending data');
        return Promise.resolve(true);
    };
}
