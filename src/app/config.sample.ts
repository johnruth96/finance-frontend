import {AuthProviderProps} from "react-oidc-context";
import {User} from "oidc-client-ts";

export const API_BASE = ""

export const DATA_GRID_LICENSE = ""

export const OIDC_CONFIG: AuthProviderProps = {
    authority: "",
    client_id: "",
    redirect_uri: "",
    onSigninCallback: (user: User | undefined) => {
    }
}

