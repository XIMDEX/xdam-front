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

const LOMFacetItem = ({ facet, facetValues, facetItem, fixed, isChecked, changeFacet }) => {
    let itemKey = facetItem.key;
    let itemID = (facet.key + '-' + facetItem.key.o_key + '-' + facetItem.id).replace(/ /g, '--');

    return (
        <div>
            <input
                type={facetItem.radio ? 'radio' : 'checkbox'}
                name={itemKey.value}
                value={facetItem.id}
                onChange={changeFacet(facetItem.radio)}
                checked={isChecked(facetItem.key.o_key, facet.key)}
                id={itemID} />
            <label htmlFor={itemID}>
                <span>
                    {itemKey.value} <strong>({facetItem.count})</strong>
                </span>
            </label>
        </div>
    );
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
                        return (<div>
                            <span style={{ fontStyle: "italic" }}>{subkey}</span>
                            {Object.keys(item).map((subitemKey) => {
                                let subitem = item[subitemKey];
                                return (
                                    <LOMFacetItem
                                        facet={facet} facetValues={groupedFacetValues} facetItem={subitem}
                                        fixed={fixed} isChecked={isChecked} changeFacet={changeFacet}/>
                                )
                            })}
                        </div>)
                    } else {
                        return (
                            <LOMFacetItem
                                facet={facet} facetValues={groupedFacetValues} facetItem={item}
                                fixed={fixed} isChecked={isChecked} changeFacet={changeFacet}/>
                        )
                    }
                })}
            </div>)
        })}
    </>);
}

export {LOMFacetItems};