import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { reloadCatalogue, setResourcesLoading, setSchemas } from "../../../appSlice";
import { setQuery, setFacetsQuery, selectQuery } from "../../../slices/organizationSlice";
import WorkspaceFacetItems from "./WorkspaceFacetItems";
import { LANGUAGE_FACET, WORKSPACES, bookLanguages } from '../../../constants';
import MainService from "../../../api/service";
import { parseWorkspace } from "../../../api/providers/workspacesProvider";
import Modal from "../../Resources/Modals/Modal/Modal";
import { Button, Icon } from "semantic-ui-react";
import { Grid } from "@material-ui/core";
import { CustomToggle } from "../../Resources/Modals/DynamicFormTemplates/CustomFields";
import AddOrEditItemFacet from "./AddOrEditFacetItem";
import Aaaa from '@material-ui/icons/Delete'

const FacetItem = ({name, facet, fixed, facetValues, supplementaryData, changeFacet, facetIsActive}) => {
    const [onHover, setHover] = useState(false)
    let auxName = name;
    const dispatch = useDispatch()
    if (facet.key === LANGUAGE_FACET && name in bookLanguages) {
        auxName = bookLanguages[name];
    }

    const handleEdit = () => {

    }

    const reloadSchemasAndCatalogue = async () => {
        const schemas = await MainService().getSchemas();
        dispatch(reloadCatalogue())
        dispatch(setSchemas(schemas));
    }

    const handleDelete = async () => {
        const _facet = facetValues[name]
        if (_facet.count >0) {
            alert('For delete this item ("'+name+'"), must be not assigned')
            return;
        }
        if (globalThis.confirm('You will be delete "'+ name +'". Are you sure?')) {
            const opts = MainService().getHttpOptions()
            let message = ''
            try {
                await fetch(_facet.route_delete, {method: 'DELETE', headers: opts.headers})
                message = 'Deleted successfully!'
                reloadSchemasAndCatalogue()
            } catch (error) {
                message = 'Deleted failed! Contact with your supplier'
            }
            alert(message)
        }

    }

    const handleHover = (inside) => {
        setHover(inside)
    }

    const getLomCategory = () => {
      
        if (facet.label === 'LOMES' || facet.label === 'LOM') {
            console.log(facetValues,"facet")
          const parts = facetValues[name].key.split('.');
      
          // Ensure there are enough parts to extract at least one value
          if (parts.length >= 3) {
            let firstValue = parts[2];
            let secondValue = parts.length >= 5 ? parts[4] : null;
      
            // Remove '_str' suffix if present
            if (firstValue.endsWith('_str')) {
              firstValue = firstValue.slice(0, -4);
            }
            if (secondValue && secondValue.endsWith('_str')) {
              secondValue = secondValue.slice(0, -4);
            }
      
            const lomCategory = secondValue ? `${firstValue} - ${secondValue}` : `${firstValue}`;
            console.log(lomCategory);
            return lomCategory;
          } else {
            console.error("Not enough parts found in facet.id");
            return null;
          }
        }
        return null;
      };
      
      
    


    return (
        <div
            onMouseEnter={() => handleHover(true)}
            onMouseLeave={() => handleHover(false)}
            style={{display: "flex", width: '100%'}}
        >
            <input
                type={facetValues[name].radio ? 'radio' : 'checkbox'}
                name={ supplementaryData ? supplementaryData.name : facet.key}
                value={fixed ? facetValues[name].id : name}
                onChange={changeFacet(facetValues[name].radio)}
                checked={facetIsActive(fixed ? facetValues.id : name, facetValues[name].key)}
                id={(facet.key + '-' + name + '-' + (facetValues[name]?.id ?? '')).replace(/ /g, '--')}
                style={{flexShrink: 3}}
            />
            <label
                htmlFor={(facet.key + '-' + name + '-' + (facetValues[name]?.id ?? '')).replace(/ /g, '--')}
                style={{flexShrink: 1, width: onHover ? '85%' : '100%', display: "flex", flexDirection: 'row'}}
            >
                {
                    facet.key === LANGUAGE_FACET
                        ?   (
                            <>
                                <span
                                    style={{
                                        display: 'inline-block',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >{auxName}</span>&nbsp;<strong>({facetValues[name].count})</strong>
                            </>
                        ) : (
                            <>
                                <span
                                    style={{
                                        display: 'inline-block',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >{supplementaryData?.[name]
                                    ? supplementaryData[name].name
                                    : facetValues[name].label ?? name
                                } - {getLomCategory()}</span>&nbsp;<strong>({facetValues[name].count})</strong>
                            </>
                        )
                }
            </label>
            <div style={{display: 'flex', flexDirection: 'row', flexShrink: 2}}>
                { onHover && facetValues[name].canEdit && facetValues[name].route && (
                    <AddOrEditItemFacet
                        editForm
                        onClose={()=>handleHover(false)}
                        facet={facetValues[name]}
                        values={facetValues[name]['values']}
                        title={`${facet.label}: "${name}"`}
                        triggerIcon={(
                            <button
                                style={{
                                    border: 'none',
                                    background: 'none',
                                    cursor: 'pointer',
                                    marginRight: -10,
                                }}
                                disabled={facetValues[name]?.values.is_default === 1}
                            ><Icon name='pencil alternate' size="small" /></button>
                        )}
                        requestOpts={{method: 'POST', headers: MainService().getHttpOptions().headers}}
                    />
                )}
                { onHover && facetValues[name].canDelete && facetValues[name].route_delete && (
                    <button
                        style={{
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            color: facetValues[name]?.values.is_default === 1 ? 'lightgray' : 'red',
                            marginRight: -10,
                        }}
                        onClick={() => {
                            console.log('click')
                            handleDelete()
                        }}
                        disabled={facetValues[name]?.values.is_default === 1}
                    ><Icon name='trash alternate' size="small" /></button>
                )}
            </div>
        </div>
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
        const facetKey = facet.values[value].key;

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

    if (facet.key === WORKSPACES) {

        const renameWorkspace = async (id: number, newName: string) => {
            await MainService().renameWorkspace(id, newName);
            const { data } = await MainService().getWorkspaces([id]);

            const nextWorkspace = parseWorkspace(data[0]);

            return nextWorkspace
        }
        return (
            <WorkspaceFacetItems
                facet={facet}
                filteredFacetValues={facetValues}
                fixed={fixed}
                isChecked={facetIsActive}
                changeFacet={changeFacet}
                supplementaryData={supplementaryData}
                limit_items={limit_items}
                renameItems={renameWorkspace}
            />
        )
    }

    return (<>
        {Object.keys(facetValues).map((label, index) => (
            <li key={index} style={{ listStyleType: "none" }}>
                <FacetItem name={label} facet={facet} fixed={fixed} facetValues={facetValues} supplementaryData={supplementaryData} changeFacet={changeFacet} facetIsActive={facetIsActive} />
            </li>
        )
        )}
    </>);
}

export default FacetItems;
