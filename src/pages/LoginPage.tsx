import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Login } from "../features/Login/Login";
import { Loading } from "../features/Loading/Loading";
import XthemeProvider from "../providers/XthemeProvider";

function LoginPage({loading}) {
    return (
        <XthemeProvider>
            <Router>
                { loading
                    ? ( <Loading text="Loading user data..." /> )
                    : ( <Login /> )
                }
            </Router>
        </XthemeProvider>
    )
}

export default LoginPage;
