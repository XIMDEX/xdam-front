import { useEffect, useRef, useState } from "react"
import MainService from "../api/service"
import { Workspace } from "../types/Workspace/Workspace";
import { WorkspaceId } from "../types/Workspace/WorkspaceId";

const useWorkspaces = (workspacesId: WorkspaceId[]) => {
    const [workspaces, setWorkspaces] = useState<Record<WorkspaceId,Workspace>>({});
    const didRun = useRef(false);

    useEffect(() => {

        const fetchWorkspaces = async () => {
            const { data } = await MainService().getWorkspaces(workspacesId)

            const fetchedWorkspaces: Array<Workspace> = data.map((raw: any) => ({
                id: raw.id,
                name: raw.name,
                organizationId: raw.organizationId,
                createdAt: raw.created_at,
                updatedAt: raw.updated_at,
            }));


            const nextWorkspaces = fetchedWorkspaces.reduce((indexedWorkspaces: Record<WorkspaceId, Workspace>, currentWorkspace: Workspace) => ({ ...indexedWorkspaces, [currentWorkspace.id]: currentWorkspace }), {});

            setWorkspaces(nextWorkspaces);

            didRun.current = true
        }

        if(didRun.current) {
            didRun.current = false;

            return;
        }

        if(workspacesId.length === 0) {
            return;
        }
        
        fetchWorkspaces();
        didRun.current = true;

    }, [workspacesId]);

    return { workspaces, setWorkspaces };
}

export default useWorkspaces;