import { fromBinaryUUID } from "binary-uuid";
import { XDIR_URL } from "../constants";

export interface XdirToken {
    id: string,
    name: string,
    surname: string,
    extraValidation: string,
    organizationsId: string[],
    groupsId: string[],
    organizationRoleIds: string[],
    expiration: number,
    roles: string[],
    username: string
}


function parse64BasedToken(token: string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

export async function login({username, password}: {username: string, password: string}): Promise<string> {

    const response = await fetch(
        `${XDIR_URL}/login-check`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password,
            })
        }
    );

    if (response.status === 401) throw new Error("Bad creadentials");
    if (response.status !== 200) throw new Error("Error");

    return (await response.json()).token;
}

export function parseJWT(token: string): XdirToken {
    const payload = parse64BasedToken(token);

    return {
        id: fromBinaryUUID(payload.id),
        name: payload.fn,
        surname: payload.ln,
        extraValidation: payload.ev,
        organizationsId: payload.os.map(fromBinaryUUID),
        groupsId: payload.gs.map(fromBinaryUUID),
        organizationRoleIds: payload.ors.map(fromBinaryUUID),
        expiration: payload.exp as number,
        roles: payload.roles,
        username: payload.username
    }
}

export function canIDo(action: string) {
    
}