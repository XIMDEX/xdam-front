import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCircleNotch, faClipboard } from '@fortawesome/free-solid-svg-icons';
import { XInput, XButton, XDropdown, XPopUp } from '@ximdex/xui-react/material';
import { COMMON_FILTERS, CORE_FILTERS, FILTERS, PARAMS } from './constants';
import './Search.scss'
import useQueryParams from '../../hooks/useQueryParams';

function Search() {
    const [viewMode, setViewMode] = useState('th');                       // list || th
    const [isFetching, setIsFetching] = useState(false);                     // TODO use this variable to control the appearance of a loading spinner
    const [fetchResults, setFetchResults] = useState(undefined);
    const [filters, setFilters] = useState({})
    const {addQueryParam, clearQueryParam, getQueryParams} = useQueryParams();

    useEffect(() => {
        const paramsURL = getQueryParams()
        if (Object.keys(paramsURL).length > 0) setFilters(paramsURL)
    }, [])

    useEffect(() => {
        if (isFetching) {
            fetchResources()
            const filterKeys = Object.keys(filters)
            if (filterKeys.length > 0) filterKeys.forEach(fk => addQueryParam(fk, filters[fk]))
        };
    }, [isFetching, filters, addQueryParam]);

    const fetchResources = () => {
        // TODO change url to stop using mockup data
        // let url = `http://xdambackv3.mhe.ximdex.net/solr/${filters?.core}/select?$q={filterQuery}`;
        let url = '/data/search.json'
        fetch(url)
            .then(response => response.json())
            .then(results => setFetchResults([]))
            .finally(() => {
                setIsFetching(false);
            });
    };

    const handleFilters = (param, value) => {
        setFilters({...filters, [param]:value})
    }

    const handleSearch = txt => {
        let newFilters = {...filters}
        if (txt.trim() === '') {
            delete newFilters.q
        } else {
            newFilters.q = txt.trim()
        }
        setFilters(newFilters)
    }

    const clearFilters = () => {
        setFilters({})
        clearQueryParam()
    }

    const handleFetchOnKeyDown = (e) => {
        if (e.key === 'Enter') {
            setIsFetching(true);
        };
    };

    const handleCopyToClipboard = (data, key = undefined) => {
        const textToCopy = key ? data?.[key] : data;

        try {
            if ('clipboard' in navigator) {
                navigator.clipboard.writeText(textToCopy);
            } else {
                throw new Error('Force catch block to execute as it looks like this browser does not support the method used to copy into the clipboard.');
            };

            XPopUp({
                message: textToCopy ? `'${textToCopy}' has been copied to your clipboad` : 'Nothing was copied onto the clipboard.',
                iconType: textToCopy ? 'success' : 'error',
                timer:'3000',
                popUpPosition:'top',
                iconColor: textToCopy ? 'ligthgreen' : 'red',
            });
        } catch(error) {
            console.error(error);

            XPopUp({
                message:`There's been an error while trying to copy '${textToCopy}' onto the clipboard. Try again from another browser.`,
                iconType:'error',
                timer:'4000',
                popUpPosition:'top',
                iconColor: 'red',
            });
        };
    };

    return (
        <div className='searchpage-container'>
            {Object.keys(filters).length === 0 && ( <Typography className='title' variant='h1' component="h1" >DAMSearch</Typography> )}
            <section className='searchbar-container'>
                {Object.keys(filters).length > 0 && ( <Typography className='title' variant='h4' component="h1" >DAMSearch</Typography> )}
                <XInput
                    label='Search bar'
                    value={filters?.q ?? ''}
                    onChange={(e) => handleSearch(e?.target?.value || e?.nativeEvent?.data || '')}
                    onKeyDown={(e) => handleFetchOnKeyDown(e)}
                    debounce={800}
                    style={{ width: '-webkit-fill-available' }}
                />
                <XButton className='search-button' onClick={() => setIsFetching(true)}>
                    <FontAwesomeIcon icon={isFetching ? faCircleNotch : faSearch} spin={isFetching} size='1x' />
                </XButton>
            </section>

            {Object.keys(filters).length > 0 && (
                <>
                    <section className='filters-container'>
                        <XButton className="clear-filters" onClick={clearFilters}>CLEAR</XButton>
                        <div className='filters-dropdowns-container'>
                            {[...(filters.hasOwnProperty('c') ? CORE_FILTERS[filters.c] : COMMON_FILTERS)]
                                .sort((a,b) => {return (FILTERS[a]?.disabled ? 1 : 0)-(FILTERS[b]?.disabled ? 1 : 0)})
                                .map((option, index) => {
                                    const filterOption = FILTERS[option];
                                    // TODO value if exists
                                    return (
                                        <XDropdown
                                            key={`filter-${option}-${index}`}
                                            label={filterOption?.label ?? 'filter'}
                                            options={filterOption?.options}
                                            value={filters?.[option]}
                                            labelOptions={filterOption?.option_label ?? 'label'}
                                            hasCheckboxes={filterOption?.multiple_selection ?? false}
                                            multiple={filterOption?.multiple_selection ?? false}
                                            className='filter-dropdown'
                                            size="small"
                                            disableClearable
                                            disabled={filterOption?.disabled ?? false}
                                            onChange={(e, value) => handleFilters(option, value.value)}
                                        />
                                    )
                                })
                            }
                        </div>
                    </section>
                    <Typography variant='h5'>{fetchResults?.response?.numFound ?? 0} resource{fetchResults?.response?.numFound === 1 ? '' : 's'} found</Typography>
                </>
            )}

            <ul className='resources-container'>
                {fetchResults?.response?.docs?.map((doc, index) => (
                    <li key={doc?.id ?? index} className={`resource-container ${viewMode} ${index % 2 === 0 ? 'odd' : 'even'}`}>
                        <div className='resource-preview-image-container'>
                            <img
                                src={`${process.env.REACT_APP_API_BASE_URL}/resource/render/${doc?.previews?.[0]}/small`}
                                alt='preview resource'
                                loading='lazy'
                                onError={(e) => { e.target.onError = null; e.target.src = "/noimg.png" }}
                            />
                        </div>
                        <div className='resource-info-container'>
                            <p>{doc?.type?.toUpperCase()}</p>
                            <h3>{doc?.name}</h3>
                        </div>
                        <div className='resource-action-container'>
                            <XButton style={{ minWidth: 'unset' }} onClick={()=> handleCopyToClipboard(doc, 'id')}>
                                {console.log(doc?.id)}
                                <FontAwesomeIcon
                                    icon={faClipboard}
                                    title={`Add id ${doc?.id} to clipboard.`}
                                    size='1x' style={{ marginRight: '6px' }}
                                />
                                <span>Id</span>
                            </XButton>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Search
