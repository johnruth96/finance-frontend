import {useAuth} from "react-oidc-context";
import {Box, Button} from "@mui/material";
import React from "react";

export const LoginPage = () => {
    const {signinRedirect} = useAuth();

    const handleClick = () => {
        signinRedirect()
    }

    return <Box sx={{p: 2, display: "flex", justifyContent: "center"}}>
        <Button onClick={handleClick} variant={"contained"}>Anmelden mit SSO</Button>
    </Box>
}