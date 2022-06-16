import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setResourcesLoading } from "../../../appSlice";
import { setQuery, setFacetsQuery, selectQuery } from "../../../slices/organizationSlice";
import WorkspaceFacetCard from "./FacedCards/WorkspaceFacedCard";

const FacetItems = ({ fixed, facet, facetValues, currentFacets}) => {
    const dispatch = useDispatch();
    const cQuery = useSelector(selectQuery);

    function isChecked(toCheck: string | number, key: string): boolean {
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
    
    async function filterRadio(evt) {
        const facetValue = evt.target.value;

        filterRadioValue(facetValue);
    }
    async function filterCheck(evt) {
        const checked = evt.target.checked;
        const facetValue = evt.target.value;

        filterCheckValue(checked, facetValue);
    }

    const filterRadioValue = (value: any, _checked = true) => {
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

    const filterCheckValue = (value: any, checked: boolean) => {
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

    const updateSelectedFacets = (isRadio: boolean): (value: any, checked?: boolean) => void => {
        return isRadio ? filterRadioValue : filterCheckValue;
    }

    if (!facetValues) return null;


    switch (facet.key) {
        case 'workspaces':
            return (
                <WorkspaceFacetCard 
                    facet={facet} 
                    fixed={fixed} 
                    isChecked={isChecked} 
                    updateFacet={updateSelectedFacets} />
            )

        default:
            return (
                <>
                {Object.keys(facetValues).map((name, index) => (
                    <li key={index} style={{ listStyleType: "none" }}>
                        <input
                            type={facetValues[name].radio ? 'radio' : 'checkbox'}
                            name={facet.key}
                            value={fixed ? facetValues[name].id : name}
                            onChange={facetValues[name].radio ? filterRadio : filterCheck}
                            checked={isChecked(fixed ? facetValues[name].id : name, facet.key)}
                            id={(facet.key + '-' + name + '-' + facetValues[name].id).replace(/ /g, '--')}
                            />
                        <label htmlFor={(facet.key + '-' + name + '-' + facetValues[name].id).replace(/ /g, '--')}>
                            <span>{name} <strong>({facetValues[name].count})</strong></span>
                        </label>

                    </li>
                )
                )}
                </>
            )
    }
}

export default FacetItems;
