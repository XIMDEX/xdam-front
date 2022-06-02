import MainService from "../api/service";
import { parseJWT, XdirToken } from "../api/XdirAuthService";
import { useNavigate } from "react-router-dom";

const useToken = (): XdirToken => {
    let navigate = useNavigate();

    try {
        const rawToken = MainService().getToken();
        return parseJWT(rawToken);
    } catch (error) {
        console.error(error);
        navigate("/login", { replace: true });
    }
}

export default useToken;