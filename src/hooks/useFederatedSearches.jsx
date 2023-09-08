import React, { useEffect, useState } from 'react'
import MainService from '../api/service'
import { FromAlfrescoIn2Parser, FromXimdexParser, toAlfrescoIn2Parser, toXimdexParser } from '../utils/federatedSearchesParsers'
import mockup_internal from '../features/Search/mockup_internal'
import mockup_external from '../features/Search/mockup_external'

const SEARCH_IN = ['internal', 'alfrescoIn2']
const CORES = ['book', 'multimedia','assessment','activity']

function useFederatedSearches() {
    const [isFetching, setIsFetching] = useState(false)
    const [errors, setErrors] = useState({})
    const [data, setData] = useState({})

    const [cancelTokens, setCancelTokens] = useState([]);

    const abort = () => {
      cancelTokens.forEach((controller) => {
        controller.abort();
      });
    };

    const search = async (params) => {
        abort();
        setIsFetching(true)
        setErrors({});
        setData({});

        let _errors = {};
        let _data = [];
        let newData

        try {

            if (window.ximdex_mockup) {
                let numFound = 0;
                let totalItems = 0;

                mockup_internal.response.docs.forEach(item => {
                    _data.push(FromXimdexParser(item))
                })
                numFound += mockup_internal.response.docs.length
                totalItems += mockup_internal.response.numFound

                mockup_external?.list?.entries.forEach(entry => {
                    _data.push(FromAlfrescoIn2Parser(entry))
                })
                numFound += mockup_external.list['pagination']['count']
                totalItems += mockup_external.list.pagination.totalItems

                _data.sort((a,b) => a.name.localeCompare(b.name))

                newData = {data: _data, items: numFound, totalItems, hasMore: numFound < totalItems}

                setData(newData)
                setErrors(_errors)
                setIsFetching(false)
                return ;
            }
            let _controllers = []
            let promises  = []
            SEARCH_IN.forEach(type => {
                if (type === 'alfrescoIn2') {
                    let contr = new AbortController()
                    let core = 'all'
                    const parsed_params = toAlfrescoIn2Parser(params)
                    promises.push({
                        id: `${type}_${core}`,
                        promise: MainService().alfrescoIn2FederatedSearches(parsed_params, core, contr.signal)
                    })
                    _controllers.push(contr)
                }
                if (type === 'internal') {
                    let parsed_params = toXimdexParser(params)
                    if (params.c) {
                        let contr = new AbortController()
                        promises.push({
                            id:`${type}_${params.c}`,
                            promise: MainService().internalFederatedSearches(parsed_params, params.c, contr.signal)
                        })
                    } else {
                        CORES.forEach(core => {
                            let contr = new AbortController()
                            promises.push({
                                id:`${type}_${core}`,
                                promise: MainService().internalFederatedSearches(parsed_params, core, contr.signal)
                            })
                        })
                    }
                }
            })

            const responses = await Promise.allSettled(promises.map(item => item.promise))
            let numFound = 0;
            let totalItems = 0
            let hasMore = false;
            responses.forEach((response, index) => {
                if (response.status === 'fulfilled') {
                    if (response.value.ok) {
                        response.value.json().then(result => {
                            if (promises[index].id.includes('internal')) {
                                result.response.docs.forEach(item => {
                                    _data.push(FromXimdexParser(item))
                                })
                                numFound += result.response.doc.lenght
                                totalItems += result.response.doc.numFound
                            } else {
                                result?.list?.entries.forEach(entry => {
                                    _data.push(FromAlfrescoIn2Parser(entry))
                                })
                                numFound += result.list['pagination']['count']
                                totalItems += result.list.pagination.totalItems

                            }
                        })
                    } else {

                    }
                } else if (response.status === 'rejected') {
                    _errors[promises[index].id] = response.reason
                }
            })
            newData = {data: _data, items: numFound, totalItems, hasMore: numFound < totalItems}
            setCancelTokens(_controllers);
        } catch(error) {
            if (!_errors.general) _errors.general = [];
            _errors.general = error.message
        } finally {
            setData(newData)
            setErrors(_errors)
            setIsFetching(false)
        }
    }

    return {
        search,
        abort,
        data,
        error: errors,
        fetching: isFetching
    }
}

export default useFederatedSearches
