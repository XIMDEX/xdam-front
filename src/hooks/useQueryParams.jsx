import React from 'react'
import { useHistory } from 'react-router-dom'

function useQueryParams() {

    const {location, push: pushLocation} = useHistory()

    const handleAddQueryParam = (params) => {
        // const currentLocation = location;
        const newSearchParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
            if (Array.isArray(params[key])) {
                newSearchParams.set(key, JSON.stringify(params[key]));
                return;
            }
            newSearchParams.set(key, params[key]);
        })
        pushLocation({ search: newSearchParams.toString() });
    };

    const clearQueryParam = () => {
        pushLocation({search: ''})
    }

    const getQueryParams = () => {
        const searchParams =  new URLSearchParams(location?.search);
        const paramsURL = Object.fromEntries(searchParams.entries())
        let output = {}

        Object.keys(paramsURL).forEach(key => {
            if (paramsURL[key].startsWith('[') && paramsURL[key].endsWith(']')) {
                try {
                    output[key] = JSON.parse(paramsURL[key])
                } catch (error) {
                    output[key] = paramsURL[key]
                    console.log('error parsing url', error)
                }
            } else {
                output[key] = paramsURL[key]
            }
        })

        return output
    }

    return {
        getQueryParams: getQueryParams,
        addQueryParam: handleAddQueryParam,
        clearQueryParam
    }
}

export default useQueryParams
