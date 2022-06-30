import { CategoryType } from "./CategoryTypes"

export default interface Category {
    id: string,
    name: string,
    type: CategoryType
}