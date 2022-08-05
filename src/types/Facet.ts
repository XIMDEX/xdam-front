export interface Facet {
    key: string,
    label: string,
    values: {
        [value: string]: {
            id: any | null,
            count: number,
            selected: boolean,
            radio: boolean
        }
    }
}