import { useEffect, useState } from "react"
import MainService from "../api/service"
import { Workspace } from "../types/Workspace";

type WorkspaceId = number;

const useWorkspaces = (workspacesId: WorkspaceId[]) => {
    const [workspaces, setWorkspaces] = useState<Record<WorkspaceId,Workspace>>({});

    useEffect(() => {

        const fetchWorkspaces = async () => {
            const {data} = await MainService().getWorkspaces(workspacesId)

            const workspaces: Array<Workspace> = data.map((raw: any) => ({
                id: raw.id,
                name: raw.name,
                organizationId: raw.organizationId,
                createdAt: raw.created_at,
                updatedAt: raw.updated_at,
            }));

            const nextWorkspace = workspaces.reduce((indexedWorkspaces: Record<WorkspaceId, Workspace>, currentWorkspace: Workspace) => ({ ...indexedWorkspaces, [currentWorkspace.id]: currentWorkspace }), {});

            setWorkspaces(nextWorkspace);
        }

        if(workspacesId.length === 0) {
            return;
        }

        if (workspacesId.every(id => Object.keys(workspaces).includes(id.toString()))) {
            return;
        }

        fetchWorkspaces();

    }, [workspacesId]);

    return workspaces;
}

export default useWorkspaces;