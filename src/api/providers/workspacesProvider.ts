import { Workspace } from "../../types/Workspace/Workspace";
import { WorkspaceId } from "../../types/Workspace/WorkspaceId";
import MainService from "../service";

export const parseWorkspace = (raw: any): Workspace => {
    return {
        id: raw.id,
        name: raw.name,
        organizationId: raw.organizationId,
        type: raw.type,
        createdAt: raw.created_at,
        updatedAt: raw.updated_at,
    }
}

const indexWorkspaces = (workspaces: Array<Workspace>): Record<WorkspaceId, Workspace> => {
    return workspaces.reduce((indexedWorkspaces: Record<WorkspaceId, Workspace>, currentWorkspace: Workspace) => ({ ...indexedWorkspaces, [currentWorkspace.id]: currentWorkspace }), {});
}

const workspacesProvider = async (workspacesId: Array<WorkspaceId>): Promise<Record<WorkspaceId, Workspace>> => {

    if (!workspacesId || !Array.isArray(workspacesId)) {
        return {};
    }
    
    const { data } = await MainService().getWorkspaces(workspacesId);

    const workspaces = data.map(parseWorkspace);

    return indexWorkspaces(workspaces);
}

export default workspacesProvider;