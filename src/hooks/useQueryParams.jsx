import React from 'react'
import { useHistory } from 'react-router-dom'

function useQueryParams() {

    const {location, push: pushLocation} = useHistory()

    const handleAddQueryParam = (params) => {
        const currentLocation = location;
        const newSearchParams = new URLSearchParams(currentLocation.search);
        Object.keys(params).forEach(key => {
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
        return paramsURL
    }

    return {
        getQueryParams: getQueryParams,
        addQueryParam: handleAddQueryParam,
        clearQueryParam
    }
}

export default useQueryParams
