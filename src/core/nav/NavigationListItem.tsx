import {useLocation, useNavigate} from "react-router-dom";
import {ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import React, {ReactNode} from "react";
import {ListItemButtonOwnProps} from "@mui/material/ListItemButton/ListItemButton";

interface NavigationListItemProps extends ListItemButtonOwnProps {
    to: string
    icon?: ReactNode
    label: ReactNode
}

export const NavigationListItem = ({to, icon, label, ...props}: NavigationListItemProps) => {
    const navigate = useNavigate()
    const location = useLocation()

    const isActive = location.pathname === `/${to}`

    const handleClick = () => {
        navigate(to)
    }

    return (
        <ListItemButton onClick={handleClick} selected={isActive} {...props}>
            <ListItemIcon>
                {icon}
            </ListItemIcon>
            <ListItemText primary={label}/>
        </ListItemButton>
    )
}

