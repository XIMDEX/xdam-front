import React from "react"

export enum QueryActions {
    UpdataCollection,
    UpdataOrganizationId,
    UpdateSearch,
    UpdateLimit,
    UpdatePage,
    ClearFacets,
    UpdateFacets,
    PushFacet,
    PopFacet,
    OverrideFacet,
}

export interface ResourceQuery {
    organizationId?: string,
    collection?: any,
    search: string,
    limit: number,
    page: number,
    facets: any
}

export function resourceQueryReducers(query: ResourceQuery, action: { type: QueryActions, payload?: any }): ResourceQuery {
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
        case QueryActions.ClearFacets:
            return {
                ...query,
                facets: {}
            }
        case QueryActions.UpdateFacets:
            return {
                ...query,
                facets: action.payload
            }
        case QueryActions.PushFacet:

            const facet = query.facets[action.payload.key];


            const values = facet
                ? [...facet, action.payload.value]
                : [action.payload.value]

             return {
                ...query,
                facets: {
                    ...query.facets,
                    [action.payload.key]: values
                }
            }
        case QueryActions.PopFacet:

            const facets = { ...query.facets };

            Object.keys(query.facets)
                .filter(key => key === action.payload.key)
                .forEach(key => facets[key].pop(action.payload.value));
          
            return {
                ...query,
                facets
            }
        case QueryActions.OverrideFacet:
            return {
                ...query,
                facets: {
                    ...query.facets,
                    [action.payload.key]: action.payload.value
                }
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
        page: 1,
        facets: null
    },
    dispatch: () => null
});