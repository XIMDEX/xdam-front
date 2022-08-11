import React, { useEffect, useState } from "react";
import { parseWorkspace } from "../../../api/providers/workspacesProvider";
import MainService from "../../../api/service";
import { Facet } from "../../../types/Facet";
import { Workspace } from "../../../types/Workspace/Workspace";
import { WorkspaceId } from "../../../types/Workspace/WorkspaceId";
import FacetActionsWrapper from "./FacetActionsWrapper/FacetActionsWrapper";

interface Props { 
    facet: Facet,
    filteredFacetValues: Facet["values"],
    fixed: boolean,
    isChecked: (name: string, facetKey: string) => boolean,
    changeFacet: (isRadio: boolean) => (event) => void,
    supplementaryData: Record<WorkspaceId, Workspace>
}

const WorkspaceFacetItems = ({ facet, filteredFacetValues, fixed, isChecked, changeFacet, supplementaryData }: Props ) => {
    const [workspaces, setWorkspaces] = useState<Record<WorkspaceId, Workspace>>(null);

    useEffect(() => {
        setWorkspaces(supplementaryData)
    }, [supplementaryData]);

    const renameWorkspace = (id: number) => {

        return async (newName: string) => {
            await MainService().renameWorkspace(id, newName);
            const { data } = await MainService().getWorkspaces([id]);

            const nextWorkspace = parseWorkspace(data[0]);

            setWorkspaces({
                ...workspaces,
                [id]: nextWorkspace
            });
        }
    }

    if (!workspaces) return null;
    if (Object.keys(workspaces).length === 0) return null;

    return (<>
            {Object.keys(filteredFacetValues).map((workspaceId, index) =>
                {
                    const values = filteredFacetValues[workspaceId];
                    const current = workspaces[workspaceId];

                    if (!workspaces[workspaceId]) {
                        return null;
                    }

                    return (
                        <li key={index} style={{ listStyleType: "none" }}>
                            <FacetActionsWrapper name={workspaces[workspaceId].name} rename={renameWorkspace(workspaces[workspaceId].id)}
                                canBeEdit={values.canBeEdit}>
                                <input
                                    type={values.radio ? 'radio' : 'checkbox'}
                                    name={workspaceId}
                                    value={workspaceId.toString()}
                                    onChange={changeFacet(values.radio)}
                                    checked={isChecked(fixed ? values.id : workspaceId, facet.key)}
                                    id={(facet.key + '-' + workspaceId + '-' + values.id).replace(/ /g, '--')}
                                />
                                <label 
                                    htmlFor={(facet.key + '-' + workspaceId + '-' + values.id).replace(/ /g, '--')}
                                    title={workspaces[workspaceId].name}
                                >
                                    <span>{workspaces[workspaceId].name}</span><strong>{`(${values.count})`}</strong>
                                </label>
                            </FacetActionsWrapper>
                        </li>
                    )
                }
            )}
        </>
    );
}

export default WorkspaceFacetItems;