import React from 'react'
import {Outlet} from 'react-router-dom'
import {Box, Drawer} from '@mui/material'
import {AuthProvider} from "./auth/AuthProvider";
import {NavigationList} from "./core/nav/NavigationList";


export const App = () => {
    return (
        <AuthProvider>
            <Box sx={{display: "flex"}}>
                <Drawer
                    sx={{
                        width: 250,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: 250,
                            boxSizing: 'border-box',
                        }
                    }}
                    variant={"permanent"}
                    anchor={"left"}
                >
                    <NavigationList/>
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
