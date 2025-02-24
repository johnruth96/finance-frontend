import {ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import React from "react";
import {useAuth} from "react-oidc-context";
import {red} from "@mui/material/colors";

export const LogoutListItem = ({}) => {
    const {removeUser, user} = useAuth();

    const handleClick = () => {
        removeUser()
    }

    return (
        <ListItemButton onClick={handleClick}>
            <ListItemText primary={"Abmelden"} secondary={user?.profile.email} sx={{color: red[700]}}/>
        </ListItemButton>
    )
}

