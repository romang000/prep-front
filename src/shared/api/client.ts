import { API_URLS, type ApiServiceName } from './config'
import { refreshTokens } from '@/features/auth/api/refresh'
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
} from '@/features/auth/model/tokenStorage'

type ApiFetchOptions = RequestInit & {
  service: ApiServiceName
}

let refreshRequest: Promise<void> | null = null

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions,
): Promise<T> {
  return requestWithAuth<T>(path, options, true)
}

export async function apiFetchBlob(
  path: string,
  options: ApiFetchOptions,
): Promise<Response> {
  return requestBlobWithAuth(path, options, true)
}

async function requestWithAuth<T>(
  path: string,
  options: ApiFetchOptions,
  canRefresh: boolean,
): Promise<T> {
  const accessToken = getAccessToken()
  const response = await fetchWithAuth(path, options, accessToken)

  if (response.status === 401 && canRefresh) {
    if (accessToken !== getAccessToken()) {
      return requestWithAuth<T>(path, options, false)
    }

    const refreshToken = getRefreshToken()

    if (refreshToken) {
      try {
        await refreshAuthTokens(refreshToken)

        return requestWithAuth<T>(path, options, false)
      } catch {
        clearAuthTokens()
      }
    }
  }

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response))
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

async function requestBlobWithAuth(
  path: string,
  options: ApiFetchOptions,
  canRefresh: boolean,
): Promise<Response> {
  const accessToken = getAccessToken()
  const response = await fetchWithAuth(path, options, accessToken)

  if (response.status === 401 && canRefresh) {
    if (accessToken !== getAccessToken()) {
      return requestBlobWithAuth(path, options, false)
    }

    const refreshToken = getRefreshToken()

    if (refreshToken) {
      try {
        await refreshAuthTokens(refreshToken)

        return requestBlobWithAuth(path, options, false)
      } catch {
        clearAuthTokens()
      }
    }
  }

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response))
  }

  return response
}

function fetchWithAuth(
  path: string,
  options: ApiFetchOptions,
  accessToken = getAccessToken(),
) {
  const { service, headers, ...restOptions } = options
  const isFormData = restOptions.body instanceof FormData

  return fetch(`${API_URLS[service]}${path}`, {
    ...restOptions,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
  })
}

async function refreshAuthTokens(refreshToken: string) {
  if (!refreshRequest) {
    refreshRequest = refreshTokens(refreshToken)
      .then((tokens) => {
        setAuthTokens(tokens)
      })
      .finally(() => {
        refreshRequest = null
      })
  }

  return refreshRequest
}

async function getApiErrorMessage(response: Response) {
  const fallbackMessage = `Ошибка запроса: ${response.status}`

  try {
    const responseText = await response.text()

    if (!responseText) {
      return fallbackMessage
    }

    try {
      const errorBody = JSON.parse(responseText) as unknown
      const serverMessage = extractServerMessage(errorBody)

      return serverMessage || fallbackMessage
    } catch {
      return responseText
    }
  } catch {
    return fallbackMessage
  }
}

function extractServerMessage(errorBody: unknown): string | null {
  if (typeof errorBody === 'string') {
    return errorBody
  }

  if (!errorBody || typeof errorBody !== 'object') {
    return null
  }

  const body = errorBody as Record<string, unknown>
  const message = body.message ?? body.error ?? body.detail ?? body.title

  return typeof message === 'string' && message.trim() ? message : null
}
