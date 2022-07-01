import { useEffect, useState } from "react";
import MainService from "../api/service";
import Category from "../types/Categories/Category";
import { CategoryTypes } from "../types/Categories/CategoryTypes";

const useCategories = (type?: CategoryTypes) => {
    const [categories, setCategories] = useState<Array<Category>>([]);

    useEffect(() => {

        const fetchCategories = async () => {

            const { data } = await MainService().getAllCategories();

            const parsed = data.map((raw: { id: string; name: string; type: string }) => ({
                id: raw.id,
                name: raw.name,
                type: raw.type as CategoryTypes
            }));
            
            setCategories(parsed);
        }

        fetchCategories();

    }, []);

    if(!type) {
        return categories;
    }

    return categories.filter(category => category.type === type);
};

export default useCategories;