import React from 'react'
import {Outlet} from 'react-router-dom'
import {faFileContract} from '@fortawesome/free-solid-svg-icons/faFileContract'
import {Box, Drawer, List} from '@mui/material'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import HomeIcon from '@mui/icons-material/Home'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import InsightsIcon from '@mui/icons-material/Insights'
import {AuthProvider} from "./auth/AuthProvider";
import {NavigationListItem} from "./core/nav/NavigationListItem";

const NAVIGATION = [
    {
        label: 'Dashboard',
        icon: <HomeIcon/>,
        to: '',
    },
    {
        label: 'Verträge',
        icon: <FontAwesomeIcon icon={faFileContract}/>,
        to: 'contracts/',
    },
    {
        label: 'Buchungen',
        icon: <LibraryBooksIcon/>,
        to: 'records/',
    },
    {
        label: 'Insights',
        icon: <InsightsIcon/>,
        to: 'insights/',
    },
]

export const App = () => {
    return (
        <AuthProvider>
            <Box sx={{display: "flex"}}>
                <Drawer sx={{
                    width: 250,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 250,
                        boxSizing: 'border-box',
                    }
                }} variant={"permanent"} anchor={"left"}>
                    <List>
                        {NAVIGATION.map(({label, to, icon}) => (
                            <NavigationListItem
                                label={label}
                                icon={icon}
                                to={to}
                                key={to}/>
                        ))}
                    </List>
                </Drawer>
                <Box
                    component="main"
                    sx={{flexGrow: 1, bgcolor: 'background.default', p: 3}}
                >
                    <Outlet/>
                </Box>
            </Box>
        </AuthProvider>
    )
}

export default App
