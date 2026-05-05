type JwtPayload = Record<string, unknown>

type UserRole = "ROLE_ADMIN" | "ROLE_USER" | string

export function getUserIdFromToken(token: string | null): number | null {
    const parsedPayload = parseJwtPayload(token)

    if (!parsedPayload) {
        return null
    }

    return readNumericClaim(parsedPayload, ["userId", "user_id", "id", "sub"])
}

export function getUserRoleFromToken(token: string | null): UserRole | null {
    const parsedPayload = parseJwtPayload(token)

    if (!parsedPayload) {
        return null
    }

    const roleValues = readRoleClaims(parsedPayload)

    return roleValues.find((role) => role === "ROLE_ADMIN") ?? roleValues[0] ?? null
}

function parseJwtPayload(token: string | null): JwtPayload | null {
    if (!token) {
        return null
    }

    try {
        const [, payload] = token.split(".")

        if (!payload) {
            return null
        }

        const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/")
        const json = decodeURIComponent(
            atob(normalizedPayload)
                .split("")
                .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
                .join(""),
        )
        return JSON.parse(json) as JwtPayload
    } catch {
        return null
    }
}

function readNumericClaim(payload: JwtPayload, claimNames: string[]) {
    for (const claimName of claimNames) {
        const value = payload[claimName]

        if (typeof value === "number") {
            return value
        }

        if (typeof value === "string") {
            const parsedValue = Number(value)

            if (!Number.isNaN(parsedValue)) {
                return parsedValue
            }
        }
    }

    return null
}

function readRoleClaims(payload: JwtPayload) {
    const roleClaims = [
        payload.role,
        payload.roles,
        payload.authorities,
        payload.authority,
    ]

    return roleClaims.flatMap(normalizeRoleValue)
}

function normalizeRoleValue(value: unknown): string[] {
    if (typeof value === "string") {
        return value.split(/[,\s]+/).filter(Boolean)
    }

    if (Array.isArray(value)) {
        return value.flatMap((item) => {
            if (typeof item === "string") {
                return [item]
            }

            if (item && typeof item === "object" && "authority" in item) {
                const authority = item.authority

                return typeof authority === "string" ? [authority] : []
            }

            return []
        })
    }

    return []
}
