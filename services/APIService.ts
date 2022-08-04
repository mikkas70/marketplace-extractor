import axios, {AxiosInstance, AxiosStatic} from "axios";
import {IMarketStructure} from "../interfaces/marketStructure";

export default class APIService {
    private axios: AxiosInstance;

    constructor() {
        this.axios = axios.create({
            baseURL: process.env.CLOUDFRONT_URL
        });

        this.axios.interceptors.response.use(
            response => response,
            error => {
                console.log('Something went wrong in this request');
            }
        )
    }
    /**
     * Get market searcheable items. Returns an array of item names.
     * @return Promise<string[]>
     */
    getMarketableItems = (): Promise<string[]> => {
        return this.axios.get('items.json').then((response) => {
            return Promise.resolve(response.data);
        });
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
