import {useLocation, useNavigate} from "react-router-dom";
import {ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import React, {ReactNode} from "react";

interface NavigationListItemProps {
    to: string
    icon: ReactNode
    label: ReactNode
}

export const NavigationListItem = ({to, icon, label}: NavigationListItemProps) => {
    const navigate = useNavigate()
    const location = useLocation()

    const isActive = location.pathname === `/${to}`

    const handleClick = () => {
        navigate(to)
    }

    return (
        <ListItemButton onClick={handleClick} selected={isActive}>
            <ListItemIcon>
                {icon}
            </ListItemIcon>
            <ListItemText primary={label}/>
        </ListItemButton>
    )
}