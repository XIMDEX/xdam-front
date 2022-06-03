import { API_BASE_URL as XDAM_BASE_URL} from "../constants";
import { XDAM_V2_URL } from '../constants';

type TokenProvider = () => string

const collectionAPI = {
    get: {
        method: 'GET',
        url: `XDAM_BASE_URL/collections`
    }
}

export default class CollectionsService {
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

    public getOrganizationCollections(organizationId: string) {
        const init = {
            method: 'GET',
            headers: this.authorizedRequestHeaders()
        }

        return fetch(
            `${XDAM_V2_URL}/organization/${organizationId}/collections`,
            init
        );
    }

    public getCollection(collectionId: number) {
        const init = {
            method: 'GET',
            headers: this.authorizedRequestHeaders()
        }

        return fetch(
            `${XDAM_V2_URL}/collection/${collectionId}`,
            init
        );
    }
}