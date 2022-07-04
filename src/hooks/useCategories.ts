import { useEffect, useState } from "react";
import MainService from "../api/service";
import Category from "../types/Categories/Category";
import { CategoryTypes } from "../types/Categories/CategoryTypes";

const useCategories = (timestamp: number, type?: CategoryTypes) => {
    const [categories, setCategories] = useState<Array<Category>>([]);

    useEffect(() => {

        const fetchCategories = async () => {
            const nextCategories = await MainService().getAllCategories();
            
            setCategories(nextCategories);
        }

        fetchCategories();

    }, [timestamp]);

    if(!type) {
        return categories;
    }

    return categories.filter(category => category.type === type);
};

export default useCategories;