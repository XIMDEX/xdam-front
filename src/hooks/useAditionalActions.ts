import { useState } from "react";

export enum AditionalAction {
    CONVERT_BOOKS_AFETER_UPDATE = "CONVERT_BOOKS_AFETER_UPDATE"
}

const useAditionalActions = () => {
    
    const [aditionalActions, setAditinalActions] = useState <AditionalAction[]>([]);

    const addAction = (action: AditionalAction) => {
        setAditinalActions([...aditionalActions, action])
    }

    const removeAction = (action: AditionalAction) => {
        const index = aditionalActions.indexOf(action, 0);
        const copy = [...aditionalActions];

        copy.splice(index, 1);
        setAditinalActions(copy);
    }


    return { aditionalActions, setAditinalActions}
}

export default useAditionalActions;