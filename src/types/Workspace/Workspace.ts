import { WorkspaceId } from "./WorkspaceId";

export interface Workspace {
    id: WorkspaceId,
    name: string,
    organizationId: number,
    type: string,
    createdAt: Date,
    updatedAt: Date
}