import React from "react";
import { useDispatch, useSelector } from "react-redux";
import MainService from "../../../../api/service";
import useWorkspaces from "../../../../hooks/useWorkspaces";
import { selectFacetsQuery, setFacetsQuery } from "../../../../slices/organizationSlice";
import { Facet } from "../../../../types/Facet";
import FacetActionsWrapper from "../FacetActionsWrapper/FacetActionsWrapper";

const WorkspaceFacetItems = (
    { facet, fixed, isChecked, updateFacet }: 
    { facet: Facet, fixed: boolean, isChecked: (name: string, facetKey: string) => boolean, updateFacet: (isRadio: boolean) => (value: any, checked: boolean) => void} ) => {
    
    const facets = useSelector(selectFacetsQuery);
    const dispatch = useDispatch();
    const workspacesData = useWorkspaces(Object.keys(facet.values).map(name => parseInt(name)));

    const changeFacet = (isRadio: boolean): (event) => void => {

        const update = updateFacet(isRadio);

        return (event) => {
            const checked = event.target.checked;
            const value = event.target.value;

            update(value, checked);
        }
    }

    const renameWorkspace = (id: number, oldName: string) => {

        return async (newName: string) => {
            await MainService().renameWorkspace(id, newName);

            if (facets?.workspaces && facets.workspaces.includes(oldName)) {
                const newFacets = {
                    ...facets,
                    workspaces: [...facets?.workspaces, newName].filter(w => w !== oldName)
                }

                dispatch(setFacetsQuery(newFacets));
            }
        }
    }

    if(Object.keys(workspacesData).length === 0) return null;

    return (<>
            {Object.keys(facet.values).map((workspaceId, index) =>
                {
                    const values = facet.values[workspaceId];

                    if (!workspacesData[workspaceId]) {
                        return null;
                    }

                    return (
                        <FacetActionsWrapper name={workspacesData[workspaceId].name} rename={renameWorkspace(workspacesData[workspaceId].id, workspacesData[workspaceId].name)}>
                            <li key={index} style={{ listStyleType: "none" }}>
                                <input
                                    type={values.radio ? 'radio' : 'checkbox'}
                                    name={workspaceId}
                                    value={workspaceId}
                                    onChange={changeFacet(values.radio)}
                                    checked={isChecked(fixed ? values.id : workspaceId, facet.key)}
                                    id={(facet.key + '-' + workspaceId + '-' + values.id).replace(/ /g, '--')}
                                    />
                                <label htmlFor={(facet.key + '-' + workspaceId + '-' + values.id).replace(/ /g, '--')}>
                                    <span>{workspacesData[workspaceId].name} <strong>({values.count})</strong></span>
                                </label>
                            </li>
                        </FacetActionsWrapper>
                    )
                }
            )}
        </>
    );
}

export default WorkspaceFacetItems;