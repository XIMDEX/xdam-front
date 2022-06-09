

const bookRequiredDataValidation = (genericData, specificData) => {

    if (!genericData['lang']) {
        return false;
    }

    if (Object.keys(specificData).length === 0) {
        return false;
    }

    for (const fileName of Object.keys(specificData)) {
        const info = specificData[fileName];

        if (info.unit === null || info.unit === undefined) {
            return false;
        }

        if (!info['extra'] || !info.extra.Link || !info.extra.Hover || !info.extra.Content) {
            return false;
        }

        if (!info.preview) {
            return false;
        }
    }

    return true
}

export default bookRequiredDataValidation;