import {OIDC_CONFIG} from "../app/config";

export const getAccessToken = (): string | null => {
    const storageKey = `oidc.user:${OIDC_CONFIG.authority}:${OIDC_CONFIG.client_id}`

    const sessionData = sessionStorage.getItem(storageKey)

    if (sessionData !== null) {
        const data = JSON.parse(sessionData)
        const accessToken = data.access_token
        if (accessToken) {
            return accessToken
        }
    }

    return null
}