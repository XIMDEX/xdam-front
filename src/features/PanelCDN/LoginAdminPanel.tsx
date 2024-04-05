import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import {
    TextField,
    Button,
    Typography
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";


function LoginAdminPanel({classes, handleAuth}) {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handlePassword = (e) => {
        setPassword(e.target.value);
    };

    const handleLogin = async (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        setLoading(true);
        setError("");
        if (password === process.env.REACT_APP_CDN_PANEL_PASSWORD) {
            handleAuth(true);
        } else {
            setError("Invalid password");
        }
        setLoading(false);
    };

    return (
        <Container
            maxWidth="sm"
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                marginTop: "-100px",
            }}
        >
            <Typography variant="h2" component={"h2"} className={classes.title}>
                CDN Panel
            </Typography>
            <form
                onSubmit={handleLogin}
                autoComplete="false"
                style={{ width: "100%" }}
            >
                <TextField
                    className={classes.mbText}
                    fullWidth
                    size="small"
                    label="Admin Password"
                    variant="outlined"
                    type="password"
                    onChange={handlePassword}
                    error={!!error}
                    helperText={error}
                />
                <Button
                    fullWidth
                    color="primary"
                    className={classes.btn}
                    variant="contained"
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : "LOGIN"}
                </Button>
            </form>
        </Container>
    );
}

export default LoginAdminPanel;
