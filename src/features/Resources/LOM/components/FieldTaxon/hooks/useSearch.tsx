import React, { useState, useEffect } from 'react'
import fetch from '../services/search'

const DEFAULT_PARAMS = {
    labellang: 'en',
    label: 'en'
}


const URI_SEARCH = 'http://localhost/ximdex/xtags/public/index.php/api/vocabularies/search?q='

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
        const response = await fetch(URI_SEARCH, txt + '&langlabel=' + DEFAULT_PARAMS.labellang + '&langsearch=' + DEFAULT_PARAMS.labellang)

        if (Array.isArray(response)) setOpts(response)
    };


    return [opts, isloading, txt, setTxt]
}

export default useSearch;