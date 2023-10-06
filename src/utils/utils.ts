import { LOM_NORMAS, VALID_LOMS } from "../constants"

export const getValidLoms = (): Array<{name: String, key: String}> => {
    const output = [];
    VALID_LOMS.forEach(tab => LOM_NORMAS[tab] && output.push(LOM_NORMAS[tab]))
    return output;
}

export const getFlagImage = (lang: String): String => {
    let path = '/noimg.png'
    switch (lang) {
        case 'en_EN':
            path = '/flags/flag-english.png'
            break;
        case 'es_ES':
            path = '/flags/flag-castellano.png'
            break;
        case 'ca_ES':
            path = '/flags/flag-catalan.png'
            break;
        case 'gl_ES':
            path = '/flags/flag-galego.png'
            break;
        case 'eu_ES':
            path = '/flags/flag-euskara.png'
            break;
        default:
            break;
    }
    return path
}
