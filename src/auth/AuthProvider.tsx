import React, {PropsWithChildren} from 'react'
import {AuthProvider as OIDCAuthProvider} from "react-oidc-context";
import {AuthController} from "./AuthController";
import {OIDC_CONFIG} from "../app/config";


export const AuthProvider = ({children}: PropsWithChildren) => {
    return (
        <OIDCAuthProvider {...OIDC_CONFIG}>
            <AuthController>{children}</AuthController>
        </OIDCAuthProvider>
    )
}
