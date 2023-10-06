import React, { useState, useEffect } from 'react';
import { Typography } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCircleNotch, faPencil, faFilter, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { XInput, XButton, XDropdown, XPopUp } from '@ximdex/xui-react/material';
import { COMMON_FILTERS, CORE_FILTERS, FILTERS } from './constants';
import './Search.scss'
import useQueryParams from '../../hooks/useQueryParams';
import useFederatedSearches from '../../hooks/useFederatedSearches';
import { ContentTypes } from '../../utils/federatedSearchesParsers';
import { getFlagImage } from '../../utils/utils';

const PS = 25

function Search() {
    const [viewMode, setViewMode] = useState('list');                       // list || th
    const [filters, setFilters] = useState({})
    const {addQueryParam, clearQueryParam, getQueryParams} = useQueryParams();
    const {abort, data: data_resources, error, fetching: isFetching, search} = useFederatedSearches()
    const [showFilters, setShowFilters] = useState(false)
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [pageShow, setPageShow] = useState([])

    useEffect(() => {
        const paramsURL = getQueryParams()
        if (Object.keys(paramsURL).length > 0) setFilters(paramsURL)
    }, [])

    useEffect(() => {
        let num_items = data_resources?.totalItems
        if (!isNaN(num_items)) {
            let tot_pages = Math.round(num_items / PS)
            if (num_items % PS > 0) tot_pages++
            setTotalPages(tot_pages)
        }
    }, [data_resources])

    useEffect(() => {
        let _data = []
        _data = [...data_resources?.data ?? []].splice(page*PS, PS)
        setPageShow(_data)
    },[page, data_resources])

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

    const handleLink = (id, link, type) => {
        if (type === 'external') {
            return window.open(link, '_blank')
        }
        console.log('open internal resource with ID: ' + id)
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
                </>
            )}

            <Typography variant='h5'>{data_resources?.totalItems ?? 0} resource{data_resources?.totalItems === 1 ? '' : 's'} found</Typography>
            <ul className='resources-container'>
                {pageShow?.map((doc, index) => (
                    <li key={doc?.id ?? index} className={`resource-container ${viewMode} ${index % 2 === 0 ? 'odd' : 'even'}`}>
                        <div className='resource-preview-image-container'>
                            <img
                                src={doc?.img ? `${process.env.REACT_APP_API_BASE_URL}/resource/render/${doc?.img}/small`: (doc.type === 'external' ? '/alfresco_logo.png' : '/noimg.png')}
                                alt='preview resource'
                                loading='lazy'
                                style={doc.type === 'external' ? {backgroundColor: 'white', padding: 20} : {}}
                                onError={(e) => { e.target.onError = null; e.target.src = "/noimg.png" }}
                            />
                        </div>
                        <div className='resource-info-container'>
                            <h3 style={{gap:15, display: 'flex', alignItems: 'center'}}>
                                {doc?.name}
                                {!doc?.languages_allowed && doc.language && getFlagImage(doc.language) !== '/noimg.png' && (
                                    <img
                                        src={getFlagImage(doc.language)}
                                        alt={doc.language}
                                        loading='lazy'
                                        height={16}
                                        onError={(e) => { e.target.onError = null; e.target.src = "/noimg.png" }}
                                    />
                                )}
                                {doc?.languages_allowed && doc.languages_allowed.map((lang, idx) => {
                                    if (getFlagImage(lang) == '/noimg.png') return null
                                    return (
                                        <img
                                            src={getFlagImage(lang)}
                                            alt={lang}
                                            loading='lazy'
                                            height={16}
                                            onError={(e) => { e.target.onError = null; e.target.src = "/noimg.png" }}
                                        />
                                    )
                                })}
                            </h3>
                            <p>{ContentTypes[doc?.resource_type]}</p>
                            {doc.description && (
                                <p
                                    style={{
                                        color: 'gray',
                                        fontSize: '0.75rem',
                                        width: '75%',
                                        display: 'inline-block',
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap'
                                    }}
                                >{doc.description}</p>
                            )}
                        <div className='tags'>
                        </div>
                        </div>
                        <div className='resource-action-container'>
                            <XButton style={{ minWidth: 'unset' }} onClick={()=> handleLink(doc.id, doc.link, doc.type)}>
                                <FontAwesomeIcon
                                    icon={doc.type === 'internal' ? faPencil : faArrowUpRightFromSquare}
                                    title={doc.type === 'internal' ? 'Edit internal resource' : 'Open external resource'}
                                    size='1x'
                                />
                            </XButton>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Search
