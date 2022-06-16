import React from "react";
import useWorkspaces from "../../../../hooks/useWorkspaces";
import { Facet } from "../../../../types/Facet";

const WorkspaceFacetItems = (
    { facet, fixed, isChecked, updateFacet }: 
    { facet: Facet, fixed: boolean, isChecked: (name: string, facetKey: string) => boolean, updateFacet: (isRadio: boolean) => (value: any, checked: boolean) => void} ) => {
    
    const workspacesData = useWorkspaces(Object.keys(facet.values).map(name => parseInt(name)));

    const changeFacet = (isRadio: boolean): (event) => void => {

        const update = updateFacet(isRadio);

        return (event) => {
            const checked = event.target.checked;
            const value = event.target.value;

            update(value, checked);
        }
    }

    if(Object.keys(workspacesData).length === 0) return null;

    return (<>
            {Object.keys(facet.values).map((workspaceId, index) =>
                {
                    const values = facet.values[workspaceId];

                    return (
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
                    )
                }
            )}
        </>
    );
}

export default WorkspaceFacetItems;