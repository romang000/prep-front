import { apiFetch } from "@/shared/api/client"
import type { AnswerGetResponse } from "@/features/answers/model/types"
import type { QuestionResponse } from "@/features/questions/model/types"
import type { TestResponse } from "@/features/tests/model/types"
import type {
    AnswerCreateRequest,
    MaterialCreateResponse,
    QuestionCreateRequest,
    TestCreateRequest,
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
