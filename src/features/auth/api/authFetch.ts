import { API_URLS } from "@/shared/api/config"

export class AuthFetchError extends Error {
    readonly status: number

    constructor(status: number) {
        super(`Ошибка запроса: ${status}`)
        this.name = "AuthFetchError"
        this.status = status
    }
}

export async function authFetch<T>(path: string, options: RequestInit): Promise<T> {
    const response = await fetch(`${API_URLS.auth}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    })

    if (!response.ok) {
        throw new AuthFetchError(response.status)
    }

    if (response.status === 204) {
        return undefined as T
    }

    return response.json() as Promise<T>
}
