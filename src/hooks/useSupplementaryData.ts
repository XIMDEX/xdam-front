import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import workspacesProvider from "../api/providers/workspacesProvider";
import { setWorkspacesData } from "../appSlice";
import { WORKPSACES } from "../constants";
import { Facet } from "../types/Facet";

const map = {
    [WORKPSACES]: {
        provider: workspacesProvider,
        dispacher: setWorkspacesData
    }
}

const useSupplementaryData = (facet: Facet) => {
    
    const [supplementaryData, setSupplementaryData] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {

        const fetchSupplementaryData = async (dispatcher?) => {
            const data = await provider(Object.keys(facet.values));

            setSupplementaryData(data);

            if(dispatcher) {
                dispatch(dispatcher(data));
            }
        }

        const provider = map[facet.key]?.provider;

        if(!provider) {
            return;
        }

        fetchSupplementaryData(map[facet.key].dispacher);
    }, []);

    return supplementaryData;
}


export default useSupplementaryData;