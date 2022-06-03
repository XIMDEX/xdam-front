import React from "react";
import LoginModal from "../features/Login/LoginModal";
import useCanIDO, { ResourceActions } from "../hooks/useCanIDo";

const CanIDo = ({ children, action }: { children: JSX.Element, action: ResourceActions}) => {

    const canIDo = useCanIDO();
    try {
        if (!canIDo(action)) {
            return React.cloneElement(children, { disabled : true });
        }
    } catch(error) {
        // return (<LoginModal display={true} />)
    }


    return children;

}

export default CanIDo;