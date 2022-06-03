import { API_BASE_URL as XDAM_BASE_URL } from "../constants";
import { XDAM_V2_URL } from '../constants';

type TokenProvider = () => string

interface catalogueOptions {
    page: number, 
    query: string,
    limit: number,
    facets?: Record<any, any>
}

export default class CatalogueService {
    private tokenProvider: TokenProvider;

    constructor(tokenProvider: TokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    private authorizedRequestHeaders() {
        return {
            'Content-Type': 'application/json',
            Authorization: this.tokenProvider()
        }
    }

    private serializeFacetsToUrlQuery(facets) {
        
        const entries = Object.entries(facets);

        return entries
                .map((a: [string, string[]]): any => {

                    return a[1]
                        .map(value => `facets[${a[0]}][]=${value}`)
                        .join('&')
                }).join('&');


    }

    public async getCatalogue(collectionId: number, options: catalogueOptions): Promise<Response> {
        const init = {
            method: 'GET',
            headers: this.authorizedRequestHeaders()
        }

        const facetsQuery = this.serializeFacetsToUrlQuery(options.facets);

        return fetch(
            `${XDAM_V2_URL}/catalogue/${collectionId}?page=${options.page}&search=${options.query}&limit=${options.limit || 48}&${facetsQuery}`,
            init
        );
    }

    public async getResource(collectionId: number, resourceId: string): Promise<Response> {
        const init = {
            method: 'GET',
            headers: this.authorizedRequestHeaders()
        }

        return fetch(
            `${XDAM_V2_URL}/catalogue/${collectionId}?facets[id]=${resourceId}`,
            init
        );
    }
}