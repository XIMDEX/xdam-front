import useToken from "./useToken"

export enum ResourceActions {
    Editresource = "EDITRESOURCE",
    Deleteresource = "DELETERESOURCE",
    CreateResource = "CREATERESOURCE"
}

const actions = {
    "EDITRESOURCE": "XDAM_EDITOR",
    "DELETERESOURCE": "XDAM_EDITOR",
    "CREATERESOURCE": "XDAM_CREATOR"
}

const useCanIDO = () => {
    const token = useToken();

    if(!token)
        return (action: ResourceActions) => false

    return (action: ResourceActions): boolean => {        
        const rol = actions[action];
        
        return token.roles.includes(rol);
    }

}

export default useCanIDO;