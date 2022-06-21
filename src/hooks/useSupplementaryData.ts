import { useEffect, useState } from "react";
import workspacesProvider from "../api/providers/workspacesProvider";
import { Facet } from "../types/Facet";

const providersMap = {
    'workspaces': workspacesProvider
}

const useSupplementaryData = (facet: Facet) => {
    
    const [supplementaryData, setSupplementaryData] = useState(null);

    useEffect(() => {

        const fetchSupplementaryData = async () => {
            const data = await provider(Object.keys(facet.values));

            setSupplementaryData(data);
        }
        
        const provider = providersMap[facet.key];

        if(!provider) {
            return;
        }

        fetchSupplementaryData();
    }, []);

    return supplementaryData;
}


export default useSupplementaryData;