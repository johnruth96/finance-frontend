import {useAuth} from "react-oidc-context";
import React from "react";

export const ErrorPage = ({}) => {
    const {error} = useAuth();

    return <div>Oops... {error?.message}</div>
}