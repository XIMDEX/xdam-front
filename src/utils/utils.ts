import { LOM_NORMAS, VALID_LOMS } from "../constants"

export const getValidLoms = (): Array<{name: String, key: String}> => {
    const output = [];
    VALID_LOMS.forEach(tab => LOM_NORMAS[tab] && output.push(LOM_NORMAS[tab]))
    return output;
}
