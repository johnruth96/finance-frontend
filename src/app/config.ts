import {AuthProviderProps} from "react-oidc-context";

export const DATA_GRID_LICENSE = process.env.DATA_GRID_LICENSE

export const OIDC_CONFIG: AuthProviderProps = {
    authority: process.env.OIDC_AUTHORITY,
    client_id: process.env.OIDC_CLIENT_ID,
    redirect_uri: process.env.OIDC_REDIRECT_URI,
    onSigninCallback: () => {
        window.history.replaceState(
            {},
            document.title,
            window.location.pathname
        )
    }
}

export const API_BASE = process.env.API_BASE