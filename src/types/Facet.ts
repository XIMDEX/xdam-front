export interface Facet {
    key: string,
    label: string,
    values: {
        [value: string]: {
            route_delete: string
            canDelete: boolean | null
            id: any | null,
            count: number,
            selected: boolean,
            radio: boolean,
            name: string | null,
            canBeEdit: boolean | null
        }
    }
}