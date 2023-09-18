import React, { useState, useEffect } from 'react';
import { Typography } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCircleNotch, faClipboard, faFilter } from '@fortawesome/free-solid-svg-icons';
import { XInput, XButton, XDropdown, XPopUp } from '@ximdex/xui-react/material';
import { COMMON_FILTERS, CORE_FILTERS, FILTERS } from './constants';
import './Search.scss'
import useQueryParams from '../../hooks/useQueryParams';
import useFederatedSearches from '../../hooks/useFederatedSearches';

function Search() {
    const [viewMode, setViewMode] = useState('list');                       // list || th
    const [filters, setFilters] = useState({})
    const {addQueryParam, clearQueryParam, getQueryParams} = useQueryParams();
    const {abort, data: data_resources, error, fetching: isFetching, search} = useFederatedSearches()
    const [showFilters, setShowFilters] = useState(false)

    useEffect(() => {
        const paramsURL = getQueryParams()
        if (Object.keys(paramsURL).length > 0) setFilters(paramsURL)
    }, [])

    useEffect(()=> {
        if (Object.keys(error).length > 0) {
            console.error('Error 5.0: ', error)

            XPopUp({
                message: "There's been an error while trying to search. Please contact with your Administrator.",
                iconType:'error',
                timer:'4000',
                popUpPosition:'top',
                iconColor: 'red',
            });
        }
    }, [error])

    const handleShowFilters = () => {
        setShowFilters(!showFilters)
    }

    const federatedSearch = () => {
        search(filters)
        addQueryParam(filters)
        return () => abort()
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
            federatedSearch()
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

    const handleCore = (core) =>{
        let newFilters = {...filters}
        if (!core) {
            delete newFilters.c
        } else {
            newFilters.c = core
        }
        setFilters(newFilters)
    }

    return (
        <div className='searchpage-container'>
            {Object.keys(filters).length === 0 && (
                    <Typography
                        className='title'
                        variant='h1'
                        component="h1"
                    >X<Typography className='title-f' variant='h1' component="span" >f</Typography>IND
                    </Typography>
            )}
            <section className='searchbar-container'>
                {Object.keys(filters).length > 0 && (
                    <Typography
                        className='title title-side'
                        variant='h4'
                        component="h1"
                    >X<Typography className='title-f title-side-f' variant='h1' component="span" >f</Typography>IND
                    </Typography>
                )}
                <XInput
                    label='Search bar'
                    value={filters?.q ?? ''}
                    onChange={(e) => handleSearch(e?.target?.value || e?.nativeEvent?.data || '')}
                    onKeyDown={(e) => handleFetchOnKeyDown(e)}
                    debounce={800}
                    style={{ width: '-webkit-fill-available' }}
                />
                <XButton className='search-button' onClick={federatedSearch}>
                    <FontAwesomeIcon icon={isFetching ? faCircleNotch : faSearch} spin={isFetching} size='1x' />
                </XButton>
                <XButton className='search-button' onClick={handleShowFilters}>
                    <FontAwesomeIcon icon={faFilter} size='1x' />
                </XButton>
            </section>

            <section className='searchpage-cores'>
                {filters?.c && (
                    <XButton key={`all_r`} size="large" variant={'outlined'} onClick={()=> handleCore()}>All resources</XButton>
                )}
                {Object.keys(CORE_FILTERS).map((core, idx) => (
                    <XButton key={`${core}_${idx}`} size="large" variant={filters?.c !== core.toLowerCase() ? 'outlined' : 'contained'} onClick={() => handleCore(core)}>{core}</XButton>
                ))}
            </section>
            {(Object.keys(filters).length > 0 || showFilters ) && (
                <>
                    <section className='filters-container'>
                        <XButton className="clear-filters" onClick={clearFilters}>CLEAR</XButton>
                        <div className='filters-dropdowns-container'>
                            {[...(filters.hasOwnProperty('c') ? CORE_FILTERS[filters.c] : COMMON_FILTERS)]
                                .sort((a,b) => {return (FILTERS[a]?.disabled ? 1 : 0)-(FILTERS[b]?.disabled ? 1 : 0)})
                                .map((option, index) => {
                                    const filterOption = FILTERS[option];
                                    return (
                                        <XDropdown
                                            key={`filter-${option}-${index}`}
                                            label={filterOption?.label ?? 'filter'}
                                            options={filterOption?.options}
                                            value={filterOption.options.filter(e => e.label === filters[option])?.[0]}
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
                    <Typography variant='h5'>{data_resources?.totalItems ?? 0} resource{data_resources?.totalItems === 1 ? '' : 's'} found</Typography>
                </>
            )}

            <ul className='resources-container'>
                {data_resources?.data?.map((doc, index) => (
                    <li key={doc?.id ?? index} className={`resource-container ${viewMode} ${index % 2 === 0 ? 'odd' : 'even'}`}>
                        <div className='resource-preview-image-container'>
                            <div className='resource-type'>{doc.type}</div>
                            <img
                                src={doc?.img ? `${process.env.REACT_APP_API_BASE_URL}/resource/render/${doc?.img}/small`: '/noimg.png'}
                                alt='preview resource'
                                loading='lazy'
                                onError={(e) => { e.target.onError = null; e.target.src = "/noimg.png" }}
                            />
                        </div>
                        <div className='resource-info-container'>
                            <p>{doc?.type?.resource_type}</p>
                            <h3>{doc?.name}</h3>
                        </div>
                        <div className='resource-action-container'>
                            <XButton style={{ minWidth: 'unset' }} onClick={()=> handleCopyToClipboard(doc, 'id')}>
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
