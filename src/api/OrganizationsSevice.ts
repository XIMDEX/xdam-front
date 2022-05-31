import { XDIR_URL } from "../constants";

type TokenProvider = () => string

const organizationsAPI = {
    get: {
        method: 'GET',
        url: `${XDIR_URL}/organizations`
    }
}

export default class OrganizationsService {

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

    public getOrganizations() {

        const init = {
            method: organizationsAPI.get.method,
            headers: this.authorizedRequestHeaders()
        }

        const request = fetch(
            organizationsAPI.get.url,
            init
        );

        return this.expectOkResponse(request);
    }
}