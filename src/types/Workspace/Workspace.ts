import { WorkspaceId } from "./WorkspaceId";

export interface Workspace {
    id: WorkspaceId,
    name: string,
    organizationId: number,
    type: string,
    createdAt: string,
    updatedAt: string
}
