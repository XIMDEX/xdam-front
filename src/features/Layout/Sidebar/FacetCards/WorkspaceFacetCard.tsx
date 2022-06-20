import React from "react";
import MainService from "../../../../api/service";
import useWorkspaces from "../../../../hooks/useWorkspaces";
import { Facet } from "../../../../types/Facet";
import FacetActionsWrapper from "../FacetActionsWrapper/FacetActionsWrapper";

const WorkspaceFacetItems = (
    { facet, fixed, isChecked, updateFacet }: 
    { facet: Facet, fixed: boolean, isChecked: (name: string, facetKey: string) => boolean, updateFacet: (isRadio: boolean) => (value: any, checked: boolean) => void} ) => {
    
    const { workspaces, setWorkspaces } = useWorkspaces(Object.keys(facet.values).map(name => parseInt(name)));

    const changeFacet = (isRadio: boolean): (event) => void => {

        const update = updateFacet(isRadio);

        return (event) => {
            const checked = event.target.checked;
            const value = event.target.value;

            update(value, checked);
        }
    }

    const renameWorkspace = (id: number) => {

        return async (newName: string) => {
            await MainService().renameWorkspace(id, newName);
            const { data } = await MainService().getWorkspaces([id]);

            const updatedWorkspaces = data[0];

            setWorkspaces({
                ...workspaces,
                [id]: {
                    id: updatedWorkspaces.id,
                    name: updatedWorkspaces.name,
                    organizationId: updatedWorkspaces.organizationId,
                    type: updatedWorkspaces.type,
                    createdAt: updatedWorkspaces.created_at,
                    updatedAt: updatedWorkspaces.updated_at,
                }
            });
        }
    }

    if(Object.keys(workspaces).length === 0) return null;

    return (<>
            {Object.keys(facet.values).map((workspaceId, index) =>
                {
                    const values = facet.values[workspaceId];

                    if (!workspaces[workspaceId]) {
                        return null;
                    }

                    return (
                        <FacetActionsWrapper name={workspaces[workspaceId].name} rename={renameWorkspace(workspaces[workspaceId].id)}>
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
                                    <span>{workspaces[workspaceId].name} <strong>({values.count})</strong></span>
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