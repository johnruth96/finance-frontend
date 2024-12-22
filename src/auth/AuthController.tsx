import React, {PropsWithChildren} from "react";
import {useAuth} from "react-oidc-context";
import {LoadingPage} from "./LoadingPage";
import {ErrorPage} from "./ErrorPage";
import {LoginPage} from "./LoginPage";

export const AuthController = ({children}: PropsWithChildren) => {
    const {isLoading, error, isAuthenticated, ...auth} = useAuth();

    if (isLoading) {
        return <LoadingPage/>
    } else if (isAuthenticated) {
        return <>
            {children}
        </>
    } else if (error) {
        return <ErrorPage/>
    } else {
        return <LoginPage/>
    }
}