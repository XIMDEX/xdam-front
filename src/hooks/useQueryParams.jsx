import React from 'react'
import { useHistory } from 'react-router-dom'

function useQueryParams() {

    const {location, push: pushLocation} = useHistory()

    const handleAddQueryParam = (param, value) => {
        const currentLocation = location;
        const newSearchParams = new URLSearchParams(currentLocation.search);
        newSearchParams.set(param, value);
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
