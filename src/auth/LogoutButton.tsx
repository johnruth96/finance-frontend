import {Button, ButtonProps} from "@mui/material";
import {useAuth} from "react-oidc-context";
import {Page} from "./Page";
import React from "react";

export const LogoutButton = (props: ButtonProps) => {
    const {removeUser} = useAuth();

    const handleClick = () => {
        removeUser()
    }

    return <Page>
        <Button onClick={handleClick} variant={"contained"} {...props}>Abmelden</Button>
    </Page>
}