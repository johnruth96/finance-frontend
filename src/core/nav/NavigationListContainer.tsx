import React, {ReactNode, useState} from "react";
import {Collapse, List, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import {ExpandLess, ExpandMore} from "@mui/icons-material";

interface NavigationListContainerProps {
    icon: ReactNode
    label: ReactNode
    children?: ReactNode
    open?: boolean
}

export const NavigationListContainer = ({icon, label, children, open: initialOpen = true}: NavigationListContainerProps) => {
    const [open, setOpen] = useState(!!initialOpen)

    const handleClick = () => {
        setOpen(prev => !prev)
    }

    return (
        <React.Fragment>
            <ListItemButton onClick={handleClick}>
                <ListItemIcon>
                    {icon}
                </ListItemIcon>
                <ListItemText primary={label}/>
                {open ? <ExpandLess/> : <ExpandMore/>}
            </ListItemButton>

            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {children}
                </List>
            </Collapse>
        </React.Fragment>
    )
}