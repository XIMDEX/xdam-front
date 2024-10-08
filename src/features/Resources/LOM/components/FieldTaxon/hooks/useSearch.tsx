import React, { useState, useEffect } from 'react'
import { XTAGS_API_BASE_URL } from '../../../../../../constants'
import fetch from '../services/search'

const DEFAULT_LANG = 'en'


const URI_SEARCH = XTAGS_API_BASE_URL + '/vocabularies/search?q='

const useSearch = () => {
    const [txt, setTxt] = useState('');
    const [opts, setOpts] = useState([])
    const [isloading, setLoading] = useState(true)
    const [count, setCount] = useState(0);


    useEffect(() => {
        if (txt.trim() !== '') {
            searchThesauro(txt);
        }
    }, [txt])


    useEffect(() => {
        setCount(count + 1)
        callApi(count + 1);
    }, [txt])
    
    const callApi = async (count) => {
        if (txt.length > 0) {
            setLoading(true)
            await searchThesauro(txt)
        }
        if (txt.length === 0) setOpts([])
    }

    const searchThesauro = async (txt) => {
        const response = await fetch(URI_SEARCH, txt + '&lang=' + DEFAULT_LANG)

        if (Array.isArray(response)) setOpts(response)
    };


    return [opts, isloading, txt, setTxt]
}

export default useSearch;