import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setResourcesLoading } from "../../../appSlice";
import { setQuery, setFacetsQuery, selectQuery } from "../../../slices/organizationSlice";
import WorkspaceFacetItems from "./WorkspaceFacetItems";
import { LANGUAGE_FACET, WORKPSACES, bookLanguages } from '../../../constants';

const FacetItem = ({name, facet, fixed, facetValues, supplementaryData, changeFacet, facetIsActive}) => {
    let auxName = name;

    if (facet.key === LANGUAGE_FACET && name in bookLanguages) {
        auxName = bookLanguages[name];
    }

    return (
        <>
            <input
                type={facetValues[name].radio ? 'radio' : 'checkbox'}
                name={supplementaryData ? supplementaryData.name : facet.key}
                value={fixed ? facetValues[name].id : name}
                onChange={changeFacet(facetValues[name].radio)}
                checked={facetIsActive(fixed ? facetValues.id : name, facet.key)}
                id={(facet.key + '-' + name + '-' + (facetValues[name]?.id ?? '')).replace(/ /g, '--')} />
            <label htmlFor={(facet.key + '-' + name + '-' + (facetValues[name]?.id ?? '')).replace(/ /g, '--')}>
                {
                    facet.key === LANGUAGE_FACET
                        ?   (<span>
                                {auxName} <strong>({facetValues[name].count})</strong>
                            </span>)
                        :   (<span>
                                {supplementaryData?.[name]
                                    ? supplementaryData[name].name
                                    : name} <strong>({facetValues[name].count})</strong>
                            </span>)
                }

            </label>
        </>
    )
}

const FacetItems = ({ supplementaryData, fixed, facet, facetValues, currentFacets, limit_items, onFilterSelected}) => {
    const dispatch = useDispatch();
    const cQuery = useSelector(selectQuery);

    const facetIsActive = (toCheck: string | number, key: string): boolean => {
        let check = Object.keys(currentFacets)
        let isChecked = false;
        check.forEach(item => {
            if (key === item) {
                if (currentFacets[item].includes(toCheck.toString())) {
                    isChecked = true;
                    return;
                }
            }
        })
        return isChecked;
    }

    const filterRadio = (value: any, _checked = true) => {
        const facetKey = facet.key;

        if (currentFacets.hasOwnProperty(facetKey)) {
            currentFacets[facetKey].splice(facetKey, 1, value)
        } else {
            currentFacets[facetKey] = []
            currentFacets[facetKey].push(value)
        }
        let nQ = {
            ...cQuery
        };
        nQ.page = 1
        dispatch(setResourcesLoading(true))
        dispatch(setQuery(nQ));
        dispatch(setFacetsQuery(currentFacets));
    }

    const filterCheck = (value: any, checked: boolean) => {
        const facetKey = facet.key;

        if (currentFacets.hasOwnProperty(facetKey)) {
            if (checked) {
                if (!currentFacets[facetKey].includes(value)) {
                    currentFacets[facetKey].push(value)
                }
            } else {
                if (currentFacets[facetKey].includes(value)) {
                    currentFacets[facetKey].forEach((item, i) => {
                        if (item === value) {
                            currentFacets[facetKey].splice(i, 1)
                            if (currentFacets[facetKey].length < 1) {
                                delete currentFacets[facetKey]
                            }
                            return;
                        }
                    })
                }
            }
        } else {
            currentFacets[facetKey] = []
            currentFacets[facetKey].push(value)
        }
        let nQ = {
            ...cQuery
        };
        nQ.page = 1
        dispatch(setResourcesLoading(true))
        dispatch(setQuery(nQ));
        dispatch(setFacetsQuery(currentFacets))
    }

    const changeFacet = (isRadio: boolean): (event) => void => {

        const update = isRadio ? filterRadio : filterCheck;

        return (event) => {
            const checked = event.target.checked;
            const value = event.target.value;
            onFilterSelected?.(value, checked)
            update(value, checked);
        }
    }

    if (!facetValues) return null;

    if (facet.key === WORKPSACES) {
        return (
            <WorkspaceFacetItems
                facet={facet}
                filteredFacetValues={facetValues}
                fixed={fixed}
                isChecked={facetIsActive}
                changeFacet={changeFacet} supplementaryData={supplementaryData} limit_items={limit_items}
            />
        )
    }

    return (<>
        {Object.keys(facetValues).map((name, index) => (
            <li key={index} style={{ listStyleType: "none" }}>
                <FacetItem name={name} facet={facet} fixed={fixed} facetValues={facetValues} supplementaryData={supplementaryData} changeFacet={changeFacet} facetIsActive={facetIsActive} />
            </li>
        )
        )}
    </>);
}

export default FacetItems;
