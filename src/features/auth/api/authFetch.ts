import { API_URLS } from "@/shared/api/config"

export async function authFetch<T>(path: string, options: RequestInit): Promise<T> {
    const response = await fetch(`${API_URLS.auth}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    })

    if (!response.ok) {
        throw new Error(`Ошибка запроса: ${response.status}`)
    }

    if (response.status === 204) {
        return undefined as T
    }

    return response.json() as Promise<T>
}
