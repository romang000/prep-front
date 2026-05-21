export type UserProfile = {
    id: number
    login: string
    email: string
    grade: "JUNIOR" | "MIDDLE" | "SENIOR" | null
    learningTrackId: number | null
}
