import React from "react";
import useCanIDO, { ResourceActions } from "../hooks/useCanIDo";


const CanIDo = ({ children, action }: { children: JSX.Element, action: ResourceActions}) => {

    const canIDo = useCanIDO();

    if (!canIDo(action)) {
        return React.cloneElement(children, { disabled : true });
    }

    return children;

}

export default CanIDo;