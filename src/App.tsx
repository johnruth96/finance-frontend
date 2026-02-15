import React from 'react'
import {Outlet} from 'react-router-dom'
import {AuthProvider} from "./auth/AuthProvider";


export const App = () => {
    return (
        <AuthProvider>
            <Outlet/>
        </AuthProvider>
    )
}

export default App
