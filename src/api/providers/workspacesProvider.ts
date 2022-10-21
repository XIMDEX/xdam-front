import { Workspace } from "../../types/Workspace/Workspace";
import { Workspaces } from "../../types/Workspace/Workspaces";
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

// const indexWorkspaces = (workspaces: Array<Workspace>): Record<Workspaces, Workspace> => {
//     return workspaces.reduce((indexedWorkspaces: Record<Workspaces, Workspace>, currentWorkspace: Workspace) => ({ ...indexedWorkspaces, [currentWorkspace.id]: currentWorkspace }), {});
// }

const workspacesProvider = async (workspaces: Array<Workspaces>): Promise<object> => {

    if(!workspaces && !Array.isArray(workspaces)) {
        return {};
    }

    // const { data } = await MainService().getWorkspaces(workspaces);

    let workspaces_parsed = {}
    Object.keys(workspaces).forEach(id => workspaces_parsed[id] = {...workspaces[id], id});

    // return indexWorkspaces(workspaces_parsed);
    return workspaces_parsed
}

export default workspacesProvider;
