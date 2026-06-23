import { apiFetch } from "@/shared/api/client"
import type { AnswerGetResponse } from "@/features/answers/model/types"
import type { LearningTrack } from "@/features/learningTracks/model/types"
import type { QuestionResponse } from "@/features/questions/model/types"
import type { TestResponse } from "@/features/tests/model/types"
import type { Topic } from "@/features/topics/model/types"
import type {
    AnswerCreateRequest,
    LearningTrackCreateRequest,
    LearningTrackUpdateRequest,
    MaterialCreateResponse,
    QuestionCreateRequest,
    TestCreateRequest,
    TitlesByIdsResponse,
    TopicCreateRequest,
    TopicUpdateRequest,
} from "../model/types"

export function createAdminTest(request: TestCreateRequest) {
    return apiFetch<TestResponse>("/tests", {
        service: "tests",
        method: "POST",
        body: JSON.stringify(request),
    })
}

export function createAdminQuestion(request: QuestionCreateRequest) {
    return apiFetch<QuestionResponse>("/questions", {
        service: "tests",
        method: "POST",
        body: JSON.stringify(request),
    })
}

export function createAdminAnswer(request: AnswerCreateRequest) {
    return apiFetch<AnswerGetResponse>("/answers", {
        service: "tests",
        method: "POST",
        body: JSON.stringify(request),
    })
}

export function createAdminMaterial(request: {
    title: string
    description?: string
    topicId: number
    subtopic?: string
    level: string
    file: File
}) {
    const formData = new FormData()

    formData.append("title", request.title)
    formData.append("description", request.description ?? "")
    formData.append("topicId", String(request.topicId))
    formData.append("subtopic", request.subtopic ?? "")
    formData.append("level", request.level)
    formData.append("file", request.file)

    return apiFetch<MaterialCreateResponse>("/materials", {
        service: "materials",
        method: "POST",
        body: formData,
    })
}

export function deleteAdminTest(id: number) {
    return apiFetch<void>(`/tests/${id}`, {
        service: "tests",
        method: "DELETE",
    })
}

export function deleteAdminQuestion(id: number) {
    return apiFetch<void>(`/questions/${id}`, {
        service: "tests",
        method: "DELETE",
    })
}

export function deleteAdminAnswer(id: number) {
    return apiFetch<void>(`/answers/${id}`, {
        service: "tests",
        method: "DELETE",
    })
}

export function deleteAdminMaterial(id: number) {
    return apiFetch<void>(`/materials/${id}`, {
        service: "materials",
        method: "DELETE",
    })
}

export function createAdminTopic(request: TopicCreateRequest) {
    return apiFetch<Topic>("/topics", {
        service: "tests",
        method: "POST",
        body: JSON.stringify(request),
    })
}

export function updateAdminTopic(id: number, request: TopicUpdateRequest) {
    return apiFetch<Topic>(`/topics/${id}`, {
        service: "tests",
        method: "PUT",
        body: JSON.stringify(request),
    })
}

export function deleteAdminTopic(id: number) {
    return apiFetch<void>(`/topics/${id}`, {
        service: "tests",
        method: "DELETE",
    })
}

export function createAdminLearningTrack(request: LearningTrackCreateRequest) {
    return apiFetch<LearningTrack>("/learning-tracks", {
        service: "tests",
        method: "POST",
        body: JSON.stringify(request),
    })
}

export function updateAdminLearningTrack(
    id: number,
    request: LearningTrackUpdateRequest,
) {
    return apiFetch<LearningTrack>(`/learning-tracks/${id}`, {
        service: "tests",
        method: "PUT",
        body: JSON.stringify(request),
    })
}

export function deleteAdminLearningTrack(id: number) {
    return apiFetch<void>(`/learning-tracks/${id}`, {
        service: "tests",
        method: "DELETE",
    })
}

export function getAdminTopicTitlesByIds(ids: number[]) {
    const searchParams = createIdsSearchParams(ids)

    return apiFetch<TitlesByIdsResponse>(`/topics/by-ids?${searchParams.toString()}`, {
        service: "tests",
        method: "GET",
    })
}

export function getAdminTestTitlesByIds(ids: number[]) {
    const searchParams = createIdsSearchParams(ids)

    return apiFetch<TitlesByIdsResponse>(`/tests/by-ids?${searchParams.toString()}`, {
        service: "tests",
        method: "GET",
    })
}

function createIdsSearchParams(ids: number[]) {
    const searchParams = new URLSearchParams()

    ids.forEach((id) => {
        searchParams.append("ids", String(id))
    })

    return searchParams
}
