import { useNavigate } from "react-router-dom";
import MainService from "../api/service";
import { parseJWT, XdirToken } from "../api/XdirAuthService";

const useToken = (): XdirToken | null  => {
    const navigate = useNavigate();
    const rawToken = MainService().getToken();

    
    if (!rawToken){ 
        console.log(rawToken);
        navigate('/login');
        return;
    }

    return parseJWT(rawToken);

}

export default useToken;