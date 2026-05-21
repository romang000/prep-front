export type LoginRequest = {
    login: string
    password: string
}

export type RegisterRequest = {
    email: string
    login: string
    password: string
    learningTrackId: number
}

export type TokenRequest = {
    token: string
}

export type AuthDto = {
    accessToken: string
    refreshToken: string
}
