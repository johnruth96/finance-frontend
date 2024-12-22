import {useAuth} from "react-oidc-context";
import {Page} from "./Page";
import {Button} from "@mui/material";
import React from "react";

export const LoginPage = () => {
    const {signinRedirect} = useAuth();

    const handleClick = () => {
        signinRedirect()
    }

    return <Page>
        <Button onClick={handleClick} variant={"contained"}>Anmelden</Button>
    </Page>
}