import React, { useEffect, useState } from "react";
import { parseWorkspace } from "../../../api/providers/workspacesProvider";
import MainService from "../../../api/service";
import { Facet } from "../../../types/Facet";
import { Workspace } from "../../../types/Workspace/Workspace";
import { WorkspaceId } from "../../../types/Workspace/WorkspaceId";
import FacetActionsWrapper from "./FacetActionsWrapper/FacetActionsWrapper";
import { useDispatch, useSelector } from "react-redux";
import { selectWorkspaceCollections, setWorkspaceCollections } from "../../../appSlice";

interface Props {
    facet: Facet,
    filteredFacetValues: Facet["values"],
    fixed: boolean,
    isChecked: (name: string, facetKey: string) => boolean,
    changeFacet: (isRadio: boolean) => (event) => void,
    supplementaryData: any, //Record<WorkspaceId, Workspace>,
    limit_items: number,
    renameItems: (id: number, newName: string) => object
}


const WorkspaceFacetItems = ({ facet, filteredFacetValues, fixed, isChecked, changeFacet, supplementaryData, limit_items=0, renameItems }: Props ) => {
    const [workspaces, setWorkspaces] = useState(null);
    const dispatch = useDispatch()
    const workspacesCollections = useSelector(selectWorkspaceCollections)
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
            const newWorkspaceCollections = workspacesCollections.map(obj => {
                if (obj.id === parseInt(id)) {
                    return { ...obj, name: newName.trim() };
                }
                return obj;
            });
            dispatch(setWorkspaceCollections(newWorkspaceCollections));
        }
    }


    if (!workspaces) return null;
    if (Object.keys(workspaces).length === 0) return null;

    return (<>
            {Object.keys(filteredFacetValues).map((workspaceId, index) =>
                {
                    const values = filteredFacetValues[workspaceId];
                    if (!workspaces[workspaceId]) {
                        return null;
                    }

                    return (
                        <li key={index} style={{ listStyleType: "none" }}>
                            <FacetActionsWrapper
                                name={workspaces[workspaceId].name} rename={renameWorkspace(workspaces[workspaceId].id)}
                                canBeEdit={values.canBeEdit} canDelete={values.canDelete} route_delete={values.route_delete} count={values.count}>
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
                                    title={`${workspaces[workspaceId].name} (${values.count})`}
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

const EditableFacetItems = ({ facet, filteredFacetValues, fixed, isChecked, changeFacet, supplementaryData, limit_items=0, renameItems }: Props ) => {
    const [workspaces, setWorkspaces] = useState<Record<WorkspaceId, Workspace>>(supplementaryData);

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
                    if (!workspaces[workspaceId]) {
                        return null;
                    }

                    return (
                        <li key={index} style={{ listStyleType: "none" }}>
                            <FacetActionsWrapper name={workspaces[workspaceId].name} rename={renameWorkspace(workspaces[workspaceId].id)} canBeEdit={values.canBeEdit} canDelete={values.canDelete} route_delete={values.route_delete} count={values.count}>
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
                                    title={`${workspaces[workspaceId].name} (${values.count})`}
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
