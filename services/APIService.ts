import axios, {AxiosInstance, AxiosStatic} from "axios";
import {IMarketStructure} from "../interfaces/marketStructure";

export default class APIService {
    private cloudfront: AxiosInstance;
    private api: AxiosInstance;

    constructor() {
        this.cloudfront = axios.create({
            baseURL: process.env.CLOUDFRONT_URL
        });

        this.api = axios.create({
            baseURL: process.env.API_URL
        });

        // TODO - Add max-ttl cache headers
        this.cloudfront.interceptors.response.use(
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
        return this.cloudfront.get('items.json').then((response) => {
            return Promise.resolve(response.data);
        });
    };

    /**
     * Send data information to the server.
     * @param world
     * @param data
     */
    sendData = (world: string, data: IMarketStructure): Promise<boolean> => {
        return this.api.post('/api/offers/store/' + world, {data: Buffer.from(JSON.stringify(data)).toString('base64')}).then(response => {
            return Promise.resolve(response.status !== 200);
        });
    };
}
