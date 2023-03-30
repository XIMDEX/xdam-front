import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import workspacesProvider from "../api/providers/workspacesProvider";
import { setWorkspacesData } from "../appSlice";
import { WORKSPACES } from "../constants";
import { Facet } from "../types/Facet";

const map = {
    [WORKSPACES]: {
        provider: workspacesProvider,
        dispacher: setWorkspacesData
    }
}

const useSupplementaryData = (facet: Facet) => {

    const [supplementaryData, setSupplementaryData] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {

        const fetchSupplementaryData = async (dispatcher?) => {
            const data = await provider(facet.values);

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
    }, [facet]);

    return supplementaryData;
}


export default useSupplementaryData;
