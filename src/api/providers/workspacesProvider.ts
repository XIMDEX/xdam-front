import { Workspace } from "../../types/Workspace/Workspace";
import { Workspaces } from "../../types/Workspace/Workspaces";

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


const workspacesProvider = async (workspaces: Array<Workspaces>): Promise<object> => {

    if(!workspaces && !Array.isArray(workspaces)) {
        return {};
    }

    let workspaces_parsed = {}
    Object.keys(workspaces).forEach(id => workspaces_parsed[id] = {...workspaces[id], id});

    return workspaces_parsed
}

export default workspacesProvider;
