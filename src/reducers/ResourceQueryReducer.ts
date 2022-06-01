import React from "react"

export enum QueryActions {
    UpdataCollection,
    UpdataOrganizationId,
    UpdateSearch,
    UpdateLimit,
    UpdatePage,
    ClearFilters
}

export interface ResourceQuery {
    organizationId?: string,
    collection?: any,
    search: string,
    limit: number,
    page: number,
}

export function resourceQueryReducers(query: ResourceQuery, action: { type: QueryActions, payload?: any }): ResourceQuery {
    // debugger;
    switch (action.type) {
        case QueryActions.UpdataCollection:
            return {
                ...query,
                collection: action.payload
            }
        case QueryActions.UpdataOrganizationId:
            return {
                ...query,
                organizationId: action.payload
            }
        case QueryActions.UpdateSearch:
            return {
                ...query,
                search: action.payload
            }
        case QueryActions.UpdateLimit:
            return {
                ...query,
                limit: action.payload
            }
        case QueryActions.UpdatePage:
            return {
                ...query,
                page: action.payload
            }
        case QueryActions.ClearFilters:
            return {
                ...query,
                search: ''
            }
        default:
            const exhaustiveCheck: never = action.type;
            throw new Error(exhaustiveCheck);
    }
}

export const ResourceQueryContex = React.createContext<{
    query: ResourceQuery;
    dispatch: React.Dispatch<any>;
}>({
    query: {
        organizationId: null,
        collection: null,
        search: '',
        limit: 48,
        page: 1
    },
    dispatch: () => null
});