import React, { useState, useEffect } from 'react';
import { XInput, XButton, XDropdown, XPopUp } from '@ximdex/xui-react/material';
import './Search.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCircleNotch, faFilter, faClipboard } from '@fortawesome/free-solid-svg-icons';


function Search() {
    // TODO: move and then import as constant
    const mutualFilters = [
        {  
            filter_key: 'core',
            label: 'collection',
            option_label: 'label',
            multiple_selection: false,
            options: [
                {key: 'multimedia', label: 'multimedia', value: 'multimedia_v3'},      // image, video, audio
                {key: 'activity', label: 'activity', value: 'activity_v3'},
                {key: 'assessment', label: 'assessment', value: 'assessment_v3'},
                {key: 'book', label: 'book', value: 'book_v3'},
            ]
        }, 
        {
            filter_key: 'active',
            label: 'active',
            option_label: 'label',
            multiple_selection: false,
            options: [
                {label: 'yes', value: 'true'},
                {label: 'no', value: 'false'},
            ]
        },
        {
            filter_key: 'derechos_autor',
            label: 'Derechos de autor',
            option_label: 'label',
            multiple_selection: false,
            options: [
                {label: 'Propietaria MHE', value: 'Propietaria MHE'},
                {label: 'Creative Comnmons', value: 'Creative Comnmons'},
                {label: 'De terceros', value: 'De terceros'},
                {label: 'Licencia GFDL', value: 'Licencia GFDL'},
                {label: 'Dominio público', value: 'Dominio público'},
            ]
        }
    ];

    // TODO: move and then import as constant
    const initFilters = {
        multimedia: [
            ...mutualFilters,
        ],
        activity: [
            ...mutualFilters,
        ],
        assessment: [
            ...mutualFilters,
        ],
        book: [ 
            ...mutualFilters,
            {
                filter_key: 'lang',
                label: 'language',
                option_label: 'label',
                multiple_selection: false,
                options: [
                    {label: 'español', value: 'es_ES'},
                    {label: 'english', value: 'en_EN'},
                    {label: 'català', value: 'ca_ES'},
                ]
            },
        ]
    };
    
    const initFilterQuery = '*:*'

    const [viewMode, setViewMode] = useState('list');                       // list || th
    const [isFetching, setIsFetching] = useState(true);                     // TODO use this variable to control the appearance of a loading spinner
    const [filterOptions, setFilterOptions] = useState(initFilters.book);
    const [filtersSelected, setFiltersSelected] = useState({
        search_term: '',
        core: {key: 'book', label: 'book', value: 'book_v3'}
    }); 
    const [filterQuery, setFilterQuery] = useState(initFilterQuery);
    const [fetchResults, setFetchResults] = useState(undefined);

    useEffect(() => {
        if (isFetching) fetchResources();
    }, [isFetching]);

    const fetchResources = () => {
        console.info('start fetching results')
        // TODO change url to stop using mockup data 
        // let url = `http://xdambackv3.mhe.ximdex.net/solr/${filters?.core}/select?$q={filterQuery}`;
        let url = '/data/search.json'
        fetch(url)
            .then(response => response.json())
            .then(results => setFetchResults(results))
            .finally(() => {
                setIsFetching(false);
            });
    };

    const modifyFiltersSelected = (key, value) => {
        setFiltersSelected(prevState => ({ ...prevState, [key]: value }));

        if (key === 'core') {
            setFilterOptions(initFilters[value?.key ?? 'mutual']);
            setFilterQuery(initFilterQuery);
        };
        
        if (key !== 'search_term' && key !== 'core') {
            // TODO test and posibly handle keys with multiple values allowed
            setFilterQuery(prevState => {
                const queryValue = value?.value ?? value;
                const params = new URLSearchParams(prevState === initFilterQuery ? '' : prevState);
                if (params.has(key)) {
                    params.set(key, queryValue);
                } else {
                    params.append(key, queryValue);
                };
                return params.toString();
            })
        };

        // TODO if key === 'search_term' (what would the key value be?)

        if (key !== 'search_term') {
            // avoid fetching while user is still writting in the search bar
            setIsFetching(true);
        };
    };

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

console.log('filtersSelected--->', filtersSelected);
console.log('filterQuery--->', filterQuery);

    return (
        <div className='searchpage-container'>

            <section className='searchbar-container'>
                <XInput
                    label='Search bar'
                    value={filtersSelected?.search_term ?? ''}
                    onChange={(e) => modifyFiltersSelected('search_term', e?.target?.value || e?.nativeEvent?.data || '')}
                    onKeyDown={(e) => handleFetchOnKeyDown(e)}
                    debounce={800}
                    style={{ width: '-webkit-fill-available' }}
                />
                <XButton className='search-button' onClick={() => setIsFetching(true)}>
                    <FontAwesomeIcon icon={isFetching ? faCircleNotch : faSearch} spin={isFetching} size='1x' />
                </XButton>
            </section>

            {filterOptions?.length > 0 &&
                <section className='filters-container'>
                    <p style={{ margin: 'unset', minWidth: 'fit-content' }}>
                        <FontAwesomeIcon icon={faFilter} style={{ marginRight: '6px' }}/> 
                        Filters: 
                    </p>
                    <div className='filters-dropdowns-container'>
                        {filterOptions?.map((filterOption, index) => (
                            <XDropdown 
                                key={filterOption?.label ?? 'filter-' + index}
                                label={filterOption?.label ?? 'filter'}
                                options={filterOption?.options}
                                value={filtersSelected?.[filterOption?.filter_key]}
                                labelOptions={filterOption?.option_label ?? 'label'}
                                hasCheckboxes={filterOption?.multiple_selection ?? false}
                                multiple={filterOption?.multiple_selection ?? false}
                                className='filter-dropdown'
                                size="small"
                                disableClearable
                                onChange={(e, value) => modifyFiltersSelected(filterOption.filter_key, value)}
                            />
                        ))}
                    </div>
                </section>
            }

            <p>{fetchResults?.response?.numFound ?? 0} resource{fetchResults?.response?.numFound === 1 ? '' : 's'} found</p>

            <ul className='resources-container'>
                {fetchResults?.response?.docs?.map((doc, index) => (
                    <li key={doc?.id ?? index} className={`resource-container ${viewMode} ${index % 2 === 0 ? 'odd' : 'even'}`}>
                        <div className='resource-preview-image-container'>
                            <img 
                                src={doc?.previews?.[0]}
                                alt='preview image' 
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