import React from 'react'
import {Link, Outlet, useLocation} from 'react-router-dom'
import {faFileContract} from '@fortawesome/free-solid-svg-icons/faFileContract'
import BottomNavigation from '@mui/material/BottomNavigation'
import {BottomNavigationAction, Paper} from '@mui/material'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import HomeIcon from '@mui/icons-material/Home'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import InsightsIcon from '@mui/icons-material/Insights'
import {AuthProvider} from "./auth/AuthProvider";

const NAVIGATION = [
    {
        label: 'Home',
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
    const location = useLocation()

    return (
        <AuthProvider>
            <Paper
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 2000,
                }}
                elevation={3}
            >
                <BottomNavigation value={location.pathname} showLabels>
                    {NAVIGATION.map((props) => (
                        <BottomNavigationAction
                            component={Link}
                            value={`/${props.to}`}
                            key={props.to}
                            {...props}
                        />
                    ))}
                </BottomNavigation>
            </Paper>

            <Outlet/>
        </AuthProvider>
    )
}

export default App
