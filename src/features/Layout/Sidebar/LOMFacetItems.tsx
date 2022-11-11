import React, { useEffect, useState } from "react";
import { parseWorkspace } from "../../../api/providers/workspacesProvider";
import MainService from "../../../api/service";
import { Facet } from "../../../types/Facet";
import FacetActionsWrapper from "./FacetActionsWrapper/FacetActionsWrapper";

interface Props { 
    facet: Facet,
    filteredFacetValues: Facet["values"],
    fixed: boolean,
    isChecked: (name: string, facetKey: string) => boolean,
    changeFacet: (isRadio: boolean) => (event) => void
}

const groupLOMFacetValues = (facetValues) => {
    let groupedFacetValues = [];

    Object.keys(facetValues).map((key) => {
        let facetItem = facetValues[key];
        let facetKey = facetItem.key;
        let facetKeyTitle = facetKey.key_title;
        let facetKeySubkey = facetKey.subkey;

        if (!groupedFacetValues.hasOwnProperty(facetKeyTitle)) {
            groupedFacetValues[facetKeyTitle] = [];
        }

        if (facetKeySubkey !== null) {
            if (!groupedFacetValues[facetKeyTitle].hasOwnProperty(facetKeySubkey)) {
                groupedFacetValues[facetKeyTitle][facetKeySubkey] = [];
            }

            groupedFacetValues[facetKeyTitle][facetKeySubkey].push(facetItem);
        } else {
            groupedFacetValues[facetKeyTitle].push(facetItem);
        }
    });

    return groupedFacetValues;
}

const LOMFacetItems = ({ facet, filteredFacetValues, fixed, isChecked, changeFacet }: Props ) => {
    let groupedFacetValues = groupLOMFacetValues(filteredFacetValues);

    return (<>
        {Object.keys(groupedFacetValues).map((key) => {
            let facetKey = groupedFacetValues[key];
            return (<div>
                <span style={{ fontWeight: "bold" }}>{key}</span>
                {Object.keys(facetKey).map((subkey) => {
                    let parsed = parseInt(subkey);
                    let item = facetKey[subkey];

                    if (isNaN(parsed)) {
                        // TODO
                    } else {
                        let itemKey = item.key;
                        return (
                            <div>
                                <input
                                    type={item.radio ? 'radio' : 'checkbox'}
                                    name={itemKey.value}
                                    value={item.id}
                                    onChange={changeFacet(item.radio)}
                                    checked={isChecked(item.id, facet.key)}
                                    id={(facet.key + '-' + item.name + '-' + item.id).replace(/ /g, '--')} />
                                <label htmlFor={(facet.key + '-' + item.name + '-' + item.id).replace(/ /g, '--')}>
                                    <span>
                                        {itemKey.value} <strong>({item.count})</strong>
                                    </span>
                                </label>
                            </div>
                        )
                    }
                })}
            </div>)
        })}
    </>);
}

export default LOMFacetItems;