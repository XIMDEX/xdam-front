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

    private async expectOkResponse(request: Promise<Response>): Promise<Response> {
        const response = await request;
        if (!response.ok)
            throw Error('Request failed');

        return response
    }

    public getOrganizationCollections(organizationId: string) {
        const init = {
            method: 'GET',
            headers: this.authorizedRequestHeaders()
        }

        const request = fetch(
            `${XDAM_V2_URL}/organization/${organizationId}/collections`,
            init
        );

        return this.expectOkResponse(request);
    }

    public getCollections(collectionId: string) {
        const init = {
            method: 'GET',
            headers: this.authorizedRequestHeaders()
        }

        const request = fetch(
            `${XDAM_V2_URL}/collection/${collectionId}`,
            init
        );

        return this.expectOkResponse(request);
    }
}