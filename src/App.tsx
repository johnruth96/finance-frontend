import React from 'react'
import {Outlet} from 'react-router-dom'
import {Box, Drawer} from '@mui/material'
import {AuthProvider} from "./auth/AuthProvider";
import {NavigationList} from "./core/nav/NavigationList";
import AppBar from '@mui/material/AppBar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const drawerWidth = 250;


export const App = () => {
    const [mobileOpen, setMobileOpen] = React.useState(false)
    const [isClosing, setIsClosing] = React.useState(false)

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen)
        }
    }

    const handleDrawerClose = () => {
        setIsClosing(true)
        setMobileOpen(false)
    }

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false)
    }

    const drawerContent = <React.Fragment>
        <Toolbar/>
        <Divider sx={{mb: 2}}/>
        <NavigationList/>
    </React.Fragment>

    return (
        <AuthProvider>
            <Box sx={{display: "flex", height: "100%"}}>
                {/* AppBar is only the right part */}
                <AppBar
                    position="fixed"
                    color={"transparent"}
                    sx={{
                        width: {sm: `calc(100% - ${drawerWidth}px)`},
                        ml: {sm: `${drawerWidth}px`},
                        boxShadow: "none",
                    }}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{mr: 2, display: {sm: 'none'}}}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="h6" noWrap component="div">
                            Finance App
                        </Typography>
                    </Toolbar>
                    <Divider/>
                </AppBar>

                {/* Drawer part */}
                <Box
                    component="nav"
                    sx={{width: {sm: drawerWidth}, flexShrink: {sm: 0}}}
                >
                    <Drawer
                        variant="temporary"
                        open={mobileOpen}
                        onTransitionEnd={handleDrawerTransitionEnd}
                        onClose={handleDrawerClose}
                        sx={{
                            display: {xs: 'block', sm: 'none'},
                            '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                        }}
                        slotProps={{
                            root: {
                                // @ts-ignore
                                keepMounted: true,
                            },
                        }}
                    >
                        {drawerContent}
                    </Drawer>
                    <Drawer
                        variant="permanent"
                        sx={{
                            display: {xs: 'none', sm: 'block'},
                            '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                        }}
                        open
                    >
                        {drawerContent}
                    </Drawer>
                </Box>

                {/* Page content */}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        width: {xs: "100%", sm: `calc(100% - ${drawerWidth}px)`},
                        marginTop: "64px"
                    }}
                >
                    <Outlet/>
                </Box>
            </Box>
        </AuthProvider>
    )
}

export default App
