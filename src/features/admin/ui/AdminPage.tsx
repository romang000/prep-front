import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react"
import { getAnswers } from "@/features/answers/api/getAnswers"
import type { AnswerGetResponse } from "@/features/answers/model/types"
import {
    createAdminAnswer,
    createAdminLearningTrack,
    createAdminMaterial,
    createAdminQuestion,
    createAdminTest,
    createAdminTopic,
    deleteAdminAnswer,
    deleteAdminLearningTrack,
    deleteAdminMaterial,
    deleteAdminQuestion,
    deleteAdminTest,
    deleteAdminTopic,
    getAdminTestTitlesByIds,
    getAdminTopicTitlesByIds,
    updateAdminLearningTrack,
    updateAdminTopic,
} from "@/features/admin/api/adminApi"
import type { Grade, TestType } from "@/features/admin/model/types"
import { getLearningTracks } from "@/features/learningTracks/api/getLearningTracks"
import type { LearningTrack } from "@/features/learningTracks/model/types"
import { getMaterials } from "@/features/materials/api/getMaterials"
import type { MaterialGetResponse } from "@/features/materials/model/types"
import { getQuestions } from "@/features/questions/api/getQuestions"
import type { QuestionResponse } from "@/features/questions/model/types"
import { getTests } from "@/features/tests/api/getTests"
import type { TestResponse } from "@/features/tests/model/types"
import { getTopics } from "@/features/topics/api/getTopics"
import type { Topic } from "@/features/topics/model/types"
import { useAuth } from "@/features/auth/model/useAuth"
import { Header } from "@/shared/ui/Header"
import { Loader } from "@/shared/ui/Loader"
import { TopBar } from "@/shared/ui/TopBar"

type AdminTab = "learningTracks" | "topics" | "tests" | "questions" | "answers" | "materials"
type PendingDelete =
    | { type: "learningTrack"; id: number; title: string }
    | { type: "topic"; id: number; title: string }
    | { type: "test"; id: number; title: string }
    | { type: "question"; id: number; title: string }
    | { type: "answer"; id: number; title: string }
    | { type: "material"; id: number; title: string }

const TABS: Array<{ id: AdminTab; label: string }> = [
    { id: "learningTracks", label: "Направления" },
    { id: "topics", label: "Темы" },
    { id: "tests", label: "Тесты" },
    { id: "questions", label: "Вопросы" },
    { id: "answers", label: "Ответы" },
    { id: "materials", label: "Материалы" },
]

const GRADES: Array<{ value: Grade; label: string }> = [
    { value: "JUNIOR", label: "Junior" },
    { value: "MIDDLE", label: "Middle" },
    { value: "SENIOR", label: "Senior" },
]

const TEST_TYPES: Array<{ value: TestType; label: string }> = [
    { value: "REGULAR", label: "Обычный" },
    { value: "DIAGNOSTIC", label: "Диагностический" },
]

export function AdminPage() {
    const { role, userId } = useAuth()
    const [activeTab, setActiveTab] = useState<AdminTab>("learningTracks")
    const [topics, setTopics] = useState<Topic[]>([])
    const [learningTracks, setLearningTracks] = useState<LearningTrack[]>([])
    const [tests, setTests] = useState<TestResponse[]>([])
    const [questions, setQuestions] = useState<QuestionResponse[]>([])
    const [answers, setAnswers] = useState<AnswerGetResponse[]>([])
    const [materials, setMaterials] = useState<MaterialGetResponse[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isMaterialsLoading, setIsMaterialsLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null)

    const [testTitle, setTestTitle] = useState("")
    const [testDescription, setTestDescription] = useState("")
    const [testType, setTestType] = useState<TestType>("REGULAR")
    const [testGrade, setTestGrade] = useState("")
    const [testTopicId, setTestTopicId] = useState("")
    const [testLearningTrackId, setTestLearningTrackId] = useState("")

    const [questionTestId, setQuestionTestId] = useState("")
    const [questionTopicId, setQuestionTopicId] = useState("")
    const [questionSubtopic, setQuestionSubtopic] = useState("")
    const [questionGrade, setQuestionGrade] = useState<Grade>("JUNIOR")
    const [questionText, setQuestionText] = useState("")
    const [questionSerialNumber, setQuestionSerialNumber] = useState("1")

    const [answerTestId, setAnswerTestId] = useState("")
    const [answerQuestionId, setAnswerQuestionId] = useState("")
    const [answerText, setAnswerText] = useState("")
    const [answerIsCorrect, setAnswerIsCorrect] = useState(false)
    const [answerExplanation, setAnswerExplanation] = useState("")

    const [materialTitle, setMaterialTitle] = useState("")
    const [materialDescription, setMaterialDescription] = useState("")
    const [materialTopicId, setMaterialTopicId] = useState("")
    const [materialSubtopic, setMaterialSubtopic] = useState("")
    const [materialLevel, setMaterialLevel] = useState<Grade>("JUNIOR")
    const [materialFile, setMaterialFile] = useState<File | null>(null)

    const [selectedLearningTrackId, setSelectedLearningTrackId] = useState("")
    const [learningTrackCode, setLearningTrackCode] = useState("")
    const [learningTrackTitle, setLearningTrackTitle] = useState("")
    const [learningTrackDescription, setLearningTrackDescription] = useState("")
    const [learningTrackTopicIds, setLearningTrackTopicIds] = useState<number[]>([])

    const [selectedTopicId, setSelectedTopicId] = useState("")
    const [topicTitle, setTopicTitle] = useState("")
    const [topicDescription, setTopicDescription] = useState("")

    const selectedAnswerQuestion = useMemo(
        () => questions.find((question) => String(question.id) === answerQuestionId),
        [answerQuestionId, questions],
    )

    const loadMaterialsForSelection = useCallback(
        async (options?: { subtopic?: string }) => {
            if (userId === null || !materialTopicId) {
                setMaterials([])
                return
            }

            try {
                setIsMaterialsLoading(true)
                const data = await getMaterials({
                    userId,
                    topicId: Number(materialTopicId),
                    level: materialLevel,
                    subtopic: options ? options.subtopic : materialSubtopic || undefined,
                    pageNumber: 0,
                    pageSize: 1000,
                })
                setMaterials(data.content)
            } catch (e) {
                console.error("Ошибка при загрузке материалов", e)
                setMaterials([])
                setError("Не удалось загрузить материалы.")
            } finally {
                setIsMaterialsLoading(false)
            }
        },
        [materialLevel, materialSubtopic, materialTopicId, userId],
    )

    useEffect(() => {
        loadBaseData()
    }, [])

    useEffect(() => {
        if (!questionTestId) {
            return
        }

        loadQuestionsForTest(Number(questionTestId))
    }, [questionTestId])

    useEffect(() => {
        if (!answerTestId) {
            setAnswers([])
            return
        }

        loadQuestionsForTest(Number(answerTestId))
    }, [answerTestId])

    useEffect(() => {
        if (!answerQuestionId) {
            setAnswers([])
            return
        }

        loadAnswersForQuestion(Number(answerQuestionId))
    }, [answerQuestionId])

    useEffect(() => {
        if (activeTab !== "materials") {
            return
        }

        if (userId === null || !materialTopicId) {
            setMaterials([])
            return
        }

        loadMaterialsForSelection()
    }, [activeTab, userId, materialTopicId, materialLevel, materialSubtopic, loadMaterialsForSelection])

    async function loadBaseData() {
        try {
            setIsLoading(true)
            setError(null)

            const [topicsPage, learningTracksData, testsPage] = await Promise.all([
                getTopics(),
                getLearningTracks(),
                getTests({ pageNumber: 0, pageSize: 1000 }),
            ])

            setTopics(topicsPage.content)
            setLearningTracks(learningTracksData)
            setTests(testsPage.content)
        } catch (e) {
            console.error("Ошибка при загрузке данных админки", e)
            setError("Не удалось загрузить данные для админки.")
        } finally {
            setIsLoading(false)
        }
    }

    async function loadQuestionsForTest(testId: number) {
        try {
            const data = await getQuestions(testId)
            const normalizedQuestions = Array.isArray(data) ? data : [data]

            setQuestions(normalizedQuestions)
            setAnswerQuestionId((currentQuestionId) => {
                if (
                    currentQuestionId &&
                    normalizedQuestions.some(
                        (question) => String(question.id) === currentQuestionId,
                    )
                ) {
                    return currentQuestionId
                }

                return ""
            })
        } catch (e) {
            console.error("Ошибка при загрузке вопросов", e)
            setQuestions([])
        }
    }

    async function loadAnswersForQuestion(questionId: number) {
        try {
            const data = await getAnswers(questionId)
            setAnswers(Array.isArray(data) ? data : [data])
        } catch (e) {
            console.error("Ошибка при загрузке ответов", e)
            setAnswers([])
        }
    }

    async function handleCreateTest(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        await submitAdminAction(async () => {
            const createdTest = await createAdminTest({
                title: testTitle,
                description: testDescription || undefined,
                type: testType,
                grade: testGrade ? (testGrade as Grade) : undefined,
                topicId: testTopicId ? Number(testTopicId) : undefined,
                learningTrackId: testLearningTrackId
                    ? Number(testLearningTrackId)
                    : undefined,
            })

            setTests((currentTests) => [createdTest, ...currentTests])
            setTestTitle("")
            setTestDescription("")
            setSuccess("Тест создан.")
        })
    }

    async function handleCreateQuestion(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        await submitAdminAction(async () => {
            const createdQuestion = await createAdminQuestion({
                testId: Number(questionTestId),
                topicId: Number(questionTopicId),
                subtopic: questionSubtopic || undefined,
                grade: questionGrade,
                wordingQuestion: questionText,
                serialNumber: Number(questionSerialNumber),
            })

            setQuestions((currentQuestions) => [...currentQuestions, createdQuestion])
            setQuestionText("")
            setQuestionSubtopic("")
            setQuestionSerialNumber(String(Number(questionSerialNumber) + 1))
            setSuccess("Вопрос создан.")
        })
    }

    async function handleCreateAnswer(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        await submitAdminAction(async () => {
            const createdAnswer = await createAdminAnswer({
                questionId: Number(answerQuestionId),
                text: answerText,
                isCorrect: answerIsCorrect,
                explanation: answerExplanation || undefined,
            })

            setAnswers((currentAnswers) => [...currentAnswers, createdAnswer])
            setAnswerText("")
            setAnswerExplanation("")
            setAnswerIsCorrect(false)
            setSuccess("Ответ создан.")
        })
    }

    async function handleCreateMaterial(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!materialFile) {
            setError("Выберите файл материала.")
            return
        }

        await submitAdminAction(async () => {
            await createAdminMaterial({
                title: materialTitle,
                description: materialDescription || undefined,
                topicId: Number(materialTopicId),
                subtopic: materialSubtopic || undefined,
                level: materialLevel,
                file: materialFile,
            })

            setMaterialTitle("")
            setMaterialDescription("")
            setMaterialSubtopic("")
            setMaterialFile(null)
            await loadMaterialsForSelection({ subtopic: undefined })
            setSuccess("Материал создан.")
        })
    }

    async function handleSubmitLearningTrack(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        await submitAdminAction(async () => {
            const request = {
                code: learningTrackCode,
                title: learningTrackTitle,
                description: learningTrackDescription || undefined,
                topics: learningTrackTopicIds,
            }

            if (selectedLearningTrackId) {
                const updatedTrack = await updateAdminLearningTrack(
                    Number(selectedLearningTrackId),
                    request,
                )
                setLearningTracks((currentTracks) =>
                    currentTracks.map((track) =>
                        track.id === updatedTrack.id ? updatedTrack : track,
                    ),
                )
                setSuccess("Направление подготовки обновлено.")
                return
            }

            const createdTrack = await createAdminLearningTrack(request)
            setLearningTracks((currentTracks) => [createdTrack, ...currentTracks])
            resetLearningTrackForm()
            setSuccess("Направление подготовки создано.")
        })
    }

    async function deleteLearningTrack(id: number) {
        await submitAdminAction(async () => {
            await deleteAdminLearningTrack(id)
            setLearningTracks((currentTracks) =>
                currentTracks.filter((track) => track.id !== id),
            )

            if (selectedLearningTrackId === String(id)) {
                resetLearningTrackForm()
            }

            setSuccess("Направление подготовки удалено.")
        })
    }

    async function deleteTest(id: number) {
        await submitAdminAction(async () => {
            await deleteAdminTest(id)
            setTests((currentTests) => currentTests.filter((test) => test.id !== id))

            if (questionTestId === String(id)) {
                setQuestionTestId("")
                setQuestions([])
            }

            if (answerTestId === String(id)) {
                setAnswerTestId("")
                setAnswerQuestionId("")
                setQuestions([])
                setAnswers([])
            }

            setSuccess("Тест удалён.")
        })
    }

    async function deleteQuestion(id: number) {
        await submitAdminAction(async () => {
            await deleteAdminQuestion(id)
            setQuestions((currentQuestions) =>
                currentQuestions.filter((question) => question.id !== id),
            )

            if (answerQuestionId === String(id)) {
                setAnswerQuestionId("")
                setAnswers([])
            }

            setSuccess("Вопрос удалён.")
        })
    }

    async function deleteAnswer(id: number) {
        await submitAdminAction(async () => {
            await deleteAdminAnswer(id)
            setAnswers((currentAnswers) =>
                currentAnswers.filter((answer) => answer.id !== id),
            )
            setSuccess("Ответ удалён.")
        })
    }

    async function deleteMaterial(id: number) {
        await submitAdminAction(async () => {
            await deleteAdminMaterial(id)
            setMaterials((currentMaterials) =>
                currentMaterials.filter((material) => material.id !== id),
            )
            setSuccess("Материал удалён.")
        })
    }

    function requestDeleteLearningTrack(track: LearningTrack) {
        setPendingDelete({
            type: "learningTrack",
            id: track.id,
            title: track.title,
        })
        setError(null)
        setSuccess(null)
    }

    function requestDeleteTest(test: TestResponse) {
        setPendingDelete({
            type: "test",
            id: test.id,
            title: test.title,
        })
        setError(null)
        setSuccess(null)
    }

    function requestDeleteQuestion(question: QuestionResponse) {
        setPendingDelete({
            type: "question",
            id: question.id,
            title: question.wordingQuestion,
        })
        setError(null)
        setSuccess(null)
    }

    function requestDeleteAnswer(answer: AnswerGetResponse) {
        setPendingDelete({
            type: "answer",
            id: answer.id,
            title: answer.text,
        })
        setError(null)
        setSuccess(null)
    }

    function requestDeleteMaterial(material: MaterialGetResponse) {
        setPendingDelete({
            type: "material",
            id: material.id,
            title: material.title,
        })
        setError(null)
        setSuccess(null)
    }

    function handleEditLearningTrack(track: LearningTrack) {
        setSelectedLearningTrackId(String(track.id))
        setLearningTrackCode(track.code)
        setLearningTrackTitle(track.title)
        setLearningTrackDescription(track.description ?? "")
        setLearningTrackTopicIds(track.topicIds ?? [])
        setError(null)
        setSuccess(null)
    }

    function resetLearningTrackForm() {
        setSelectedLearningTrackId("")
        setLearningTrackCode("")
        setLearningTrackTitle("")
        setLearningTrackDescription("")
        setLearningTrackTopicIds([])
    }

    async function handleSubmitTopic(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        await submitAdminAction(async () => {
            const request = {
                title: topicTitle,
                description: topicDescription || undefined,
            }

            if (selectedTopicId) {
                const updatedTopic = await updateAdminTopic(Number(selectedTopicId), request)
                setTopics((currentTopics) =>
                    currentTopics.map((topic) =>
                        topic.id === updatedTopic.id ? updatedTopic : topic,
                    ),
                )
                setSuccess("Тема обновлена.")
                return
            }

            const createdTopic = await createAdminTopic(request)
            setTopics((currentTopics) => [createdTopic, ...currentTopics])
            resetTopicForm()
            setSuccess("Тема создана.")
        })
    }

    async function deleteTopic(id: number) {
        await submitAdminAction(async () => {
            await deleteAdminTopic(id)
            setTopics((currentTopics) => currentTopics.filter((topic) => topic.id !== id))
            setLearningTracks((currentTracks) =>
                currentTracks.map((track) => ({
                    ...track,
                    topicIds: track.topicIds.filter((topicId) => topicId !== id),
                })),
            )

            if (selectedTopicId === String(id)) {
                resetTopicForm()
            }

            setSuccess("Тема удалена.")
        })
    }

    function requestDeleteTopic(topic: Topic) {
        setPendingDelete({
            type: "topic",
            id: topic.id,
            title: topic.title,
        })
        setError(null)
        setSuccess(null)
    }

    function handleEditTopic(topic: Topic) {
        setSelectedTopicId(String(topic.id))
        setTopicTitle(topic.title)
        setTopicDescription(topic.description ?? "")
        setError(null)
        setSuccess(null)
    }

    function resetTopicForm() {
        setSelectedTopicId("")
        setTopicTitle("")
        setTopicDescription("")
    }

    async function submitAdminAction(action: () => Promise<void>) {
        try {
            setIsSubmitting(true)
            setError(null)
            setSuccess(null)
            await action()
        } catch (e) {
            console.error("Ошибка при сохранении", e)
            setError(await getAdminErrorMessage(e))
        } finally {
            setIsSubmitting(false)
        }
    }

    async function handleConfirmDelete() {
        if (!pendingDelete) {
            return
        }

        const entityToDelete = pendingDelete

        switch (entityToDelete.type) {
            case "learningTrack":
                await deleteLearningTrack(entityToDelete.id)
                break
            case "topic":
                await deleteTopic(entityToDelete.id)
                break
            case "test":
                await deleteTest(entityToDelete.id)
                break
            case "question":
                await deleteQuestion(entityToDelete.id)
                break
            case "answer":
                await deleteAnswer(entityToDelete.id)
                break
            case "material":
                await deleteMaterial(entityToDelete.id)
                break
        }

        setPendingDelete(null)
    }

    function handleCancelDelete() {
        if (!isSubmitting) {
            setPendingDelete(null)
        }
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <div className="mx-auto max-w-7xl px-6 py-8">
                <TopBar
                    rightContent={
                        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium uppercase text-slate-600">
                            {role ?? "ROLE_ADMIN"}
                        </span>
                    }
                />

                <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm shadow-slate-950/5">
                    <Header
                        title="Панель администратора"
                        description="Управление учебным контентом и тестовыми заданиями."
                    />

                    <div className="mb-6 flex flex-wrap gap-2">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => {
                                    setActiveTab(tab.id)
                                    setError(null)
                                    setSuccess(null)
                                }}
                                className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                                    activeTab === tab.id
                                        ? "border-slate-950 bg-slate-950 text-white"
                                        : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {isLoading && <Loader />}

                    {!isLoading && (
                        <div className="space-y-6">
                            {error && (
                                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                                    {success}
                                </div>
                            )}

                            {activeTab === "learningTracks" && (
                                <LearningTracksAdminPanel
                                    learningTracks={learningTracks}
                                    topics={topics}
                                    selectedId={selectedLearningTrackId}
                                    code={learningTrackCode}
                                    title={learningTrackTitle}
                                    description={learningTrackDescription}
                                    topicIds={learningTrackTopicIds}
                                    isSubmitting={isSubmitting}
                                    onCodeChange={setLearningTrackCode}
                                    onTitleChange={setLearningTrackTitle}
                                    onDescriptionChange={setLearningTrackDescription}
                                    onTopicIdsChange={setLearningTrackTopicIds}
                                    onEdit={handleEditLearningTrack}
                                    onDelete={requestDeleteLearningTrack}
                                    onReset={resetLearningTrackForm}
                                    onSubmit={handleSubmitLearningTrack}
                                />
                            )}

                            {activeTab === "topics" && (
                                <TopicsAdminPanel
                                    topics={topics}
                                    learningTracks={learningTracks}
                                    selectedId={selectedTopicId}
                                    title={topicTitle}
                                    description={topicDescription}
                                    isSubmitting={isSubmitting}
                                    onTitleChange={setTopicTitle}
                                    onDescriptionChange={setTopicDescription}
                                    onEdit={handleEditTopic}
                                    onDelete={requestDeleteTopic}
                                    onReset={resetTopicForm}
                                    onSubmit={handleSubmitTopic}
                                />
                            )}

                            {activeTab === "tests" && (
                                <TestsAdminPanel
                                    tests={tests}
                                    topics={topics}
                                    learningTracks={learningTracks}
                                    title={testTitle}
                                    description={testDescription}
                                    type={testType}
                                    grade={testGrade}
                                    topicId={testTopicId}
                                    learningTrackId={testLearningTrackId}
                                    isSubmitting={isSubmitting}
                                    onTitleChange={setTestTitle}
                                    onDescriptionChange={setTestDescription}
                                    onTypeChange={setTestType}
                                    onGradeChange={setTestGrade}
                                    onTopicChange={setTestTopicId}
                                    onLearningTrackChange={setTestLearningTrackId}
                                    onDelete={requestDeleteTest}
                                    onSubmit={handleCreateTest}
                                />
                            )}

                            {activeTab === "questions" && (
                                <QuestionsAdminPanel
                                    tests={tests}
                                    topics={topics}
                                    questions={questions}
                                    testId={questionTestId}
                                    topicId={questionTopicId}
                                    subtopic={questionSubtopic}
                                    grade={questionGrade}
                                    text={questionText}
                                    serialNumber={questionSerialNumber}
                                    isSubmitting={isSubmitting}
                                    onTestChange={setQuestionTestId}
                                    onTopicChange={setQuestionTopicId}
                                    onSubtopicChange={setQuestionSubtopic}
                                    onGradeChange={setQuestionGrade}
                                    onTextChange={setQuestionText}
                                    onSerialNumberChange={setQuestionSerialNumber}
                                    onDelete={requestDeleteQuestion}
                                    onSubmit={handleCreateQuestion}
                                />
                            )}

                            {activeTab === "answers" && (
                                <AnswersAdminPanel
                                    tests={tests}
                                    questions={questions}
                                    answers={answers}
                                    selectedQuestion={selectedAnswerQuestion}
                                    testId={answerTestId}
                                    questionId={answerQuestionId}
                                    text={answerText}
                                    isCorrect={answerIsCorrect}
                                    explanation={answerExplanation}
                                    isSubmitting={isSubmitting}
                                    onTestChange={setAnswerTestId}
                                    onQuestionChange={setAnswerQuestionId}
                                    onTextChange={setAnswerText}
                                    onCorrectChange={setAnswerIsCorrect}
                                    onExplanationChange={setAnswerExplanation}
                                    onDelete={requestDeleteAnswer}
                                    onSubmit={handleCreateAnswer}
                                />
                            )}

                            {activeTab === "materials" && (
                                <MaterialsAdminPanel
                                    topics={topics}
                                    title={materialTitle}
                                    description={materialDescription}
                                    topicId={materialTopicId}
                                    subtopic={materialSubtopic}
                                    level={materialLevel}
                                    fileName={materialFile?.name ?? ""}
                                    materials={materials}
                                    isMaterialsLoading={isMaterialsLoading}
                                    isSubmitting={isSubmitting}
                                    onTitleChange={setMaterialTitle}
                                    onDescriptionChange={setMaterialDescription}
                                    onTopicChange={setMaterialTopicId}
                                    onSubtopicChange={setMaterialSubtopic}
                                    onLevelChange={setMaterialLevel}
                                    onFileChange={setMaterialFile}
                                    onDelete={requestDeleteMaterial}
                                    onSubmit={handleCreateMaterial}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>

            {pendingDelete && (
                <ConfirmDeleteDialog
                    title={getDeleteDialogTitle(pendingDelete.type)}
                    description={`"${pendingDelete.title}" будет удалено без возможности восстановить это действие.`}
                    isSubmitting={isSubmitting}
                    onCancel={handleCancelDelete}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </div>
    )
}

async function getAdminErrorMessage(error: unknown) {
    if (!(error instanceof Error)) {
        return "Не удалось сохранить изменения."
    }

    const topicIds = extractRelatedEntityIds(error.message, "topicIds")
    const testIds = extractRelatedEntityIds(error.message, "testIds")

    if (topicIds.length === 0 && testIds.length === 0) {
        return error.message
    }

    try {
        const [topicTitles, testTitles] = await Promise.all([
            topicIds.length > 0
                ? getAdminTopicTitlesByIds(topicIds).then((response) => response.title)
                : Promise.resolve([]),
            testIds.length > 0
                ? getAdminTestTitlesByIds(testIds).then((response) => response.title)
                : Promise.resolve([]),
        ])

        const relatedEntities = [
            topicIds.length > 0 && `Темы: ${formatRelatedTitles(topicTitles, topicIds, "Тема")}`,
            testIds.length > 0 && `Тесты: ${formatRelatedTitles(testTitles, testIds, "Тест")}`,
        ].filter(Boolean)

        return `Удаление невозможно, пока есть связанные сущности. ${relatedEntities.join(". ")}.`
    } catch (e) {
        console.error("Ошибка при загрузке названий связанных сущностей", e)
        return error.message
    }
}

function extractRelatedEntityIds(message: string, fieldName: string) {
    const match = message.match(new RegExp(`${fieldName}=\\[([^\\]]*)\\]`))

    if (!match?.[1]) {
        return []
    }

    return match[1]
        .split(",")
        .map((id) => Number(id.trim()))
        .filter((id) => Number.isFinite(id))
}

function formatRelatedTitles(titles: string[], ids: number[], fallbackEntityName: string) {
    if (titles.length > 0) {
        return titles.join(", ")
    }

    return ids.map((id) => `${fallbackEntityName} #${id}`).join(", ")
}

function getDeleteDialogTitle(type: PendingDelete["type"]) {
    const titles: Record<PendingDelete["type"], string> = {
        learningTrack: "Удалить направление?",
        topic: "Удалить тему?",
        test: "Удалить тест?",
        question: "Удалить вопрос?",
        answer: "Удалить ответ?",
        material: "Удалить материал?",
    }

    return titles[type]
}

function LearningTracksAdminPanel(props: {
    learningTracks: LearningTrack[]
    topics: Topic[]
    selectedId: string
    code: string
    title: string
    description: string
    topicIds: number[]
    isSubmitting: boolean
    onCodeChange: (value: string) => void
    onTitleChange: (value: string) => void
    onDescriptionChange: (value: string) => void
    onTopicIdsChange: (value: number[]) => void
    onEdit: (track: LearningTrack) => void
    onDelete: (track: LearningTrack) => void
    onReset: () => void
    onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
    const topicTitleById = useMemo(() => {
        return new Map(props.topics.map((topic) => [topic.id, topic.title]))
    }, [props.topics])

    return (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
            <form className="space-y-4" onSubmit={props.onSubmit}>
                <AdminSectionTitle
                    title={
                        props.selectedId
                            ? "Изменить направление"
                            : "Создать направление"
                    }
                />
                <TextInput label="Код" value={props.code} onChange={props.onCodeChange} required />
                <TextInput
                    label="Название"
                    value={props.title}
                    onChange={props.onTitleChange}
                    required
                />
                <TextArea
                    label="Описание"
                    value={props.description}
                    onChange={props.onDescriptionChange}
                />
                <CheckboxList
                    label="Темы направления"
                    options={props.topics.map((topic) => ({
                        value: topic.id,
                        label: topic.title,
                    }))}
                    selectedValues={props.topicIds}
                    onChange={props.onTopicIdsChange}
                    emptyText="Сначала создайте темы"
                />
                <SubmitButton isSubmitting={props.isSubmitting}>
                    {props.selectedId ? "Сохранить направление" : "Создать направление"}
                </SubmitButton>
                {props.selectedId && (
                    <SecondaryButton onClick={props.onReset}>
                        Очистить форму
                    </SecondaryButton>
                )}
            </form>

            <AdminEntityList
                title="Направления подготовки"
                emptyText="Направления не найдены"
                items={props.learningTracks.map((track) => ({
                    id: track.id,
                    title: track.title,
                    description:
                        [
                            track.code,
                            track.description,
                            track.topicIds
                                .map((topicId) => topicTitleById.get(topicId) ?? `Тема #${topicId}`)
                                .join(", "),
                        ]
                            .filter(Boolean)
                            .join(" · ") || undefined,
                    onEdit: () => props.onEdit(track),
                    onDelete: () => props.onDelete(track),
                }))}
            />
        </div>
    )
}

function TopicsAdminPanel(props: {
    topics: Topic[]
    learningTracks: LearningTrack[]
    selectedId: string
    title: string
    description: string
    isSubmitting: boolean
    onTitleChange: (value: string) => void
    onDescriptionChange: (value: string) => void
    onEdit: (topic: Topic) => void
    onDelete: (topic: Topic) => void
    onReset: () => void
    onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
    function getTopicTrackTitles(topicId: number) {
        return props.learningTracks
            .filter((track) => track.topicIds.includes(topicId))
            .map((track) => track.title)
            .join(", ")
    }

    return (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
            <form className="space-y-4" onSubmit={props.onSubmit}>
                <AdminSectionTitle title={props.selectedId ? "Изменить тему" : "Создать тему"} />
                <TextInput
                    label="Название"
                    value={props.title}
                    onChange={props.onTitleChange}
                    required
                />
                <TextArea
                    label="Описание"
                    value={props.description}
                    onChange={props.onDescriptionChange}
                />
                <SubmitButton isSubmitting={props.isSubmitting}>
                    {props.selectedId ? "Сохранить тему" : "Создать тему"}
                </SubmitButton>
                {props.selectedId && (
                    <SecondaryButton onClick={props.onReset}>
                        Очистить форму
                    </SecondaryButton>
                )}
            </form>

            <AdminEntityList
                title="Темы"
                emptyText="Темы не найдены"
                items={props.topics.map((topic) => {
                    const trackTitles = getTopicTrackTitles(topic.id)

                    return {
                        id: topic.id,
                        title: topic.title,
                        description: [topic.description, trackTitles && `Направления: ${trackTitles}`]
                            .filter(Boolean)
                            .join(" · ") || undefined,
                        onEdit: () => props.onEdit(topic),
                        onDelete: () => props.onDelete(topic),
                    }
                })}
            />
        </div>
    )
}

function TestsAdminPanel(props: {
    tests: TestResponse[]
    topics: Topic[]
    learningTracks: LearningTrack[]
    title: string
    description: string
    type: TestType
    grade: string
    topicId: string
    learningTrackId: string
    isSubmitting: boolean
    onTitleChange: (value: string) => void
    onDescriptionChange: (value: string) => void
    onTypeChange: (value: TestType) => void
    onGradeChange: (value: string) => void
    onTopicChange: (value: string) => void
    onLearningTrackChange: (value: string) => void
    onDelete: (test: TestResponse) => void
    onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
    return (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
            <form className="space-y-4" onSubmit={props.onSubmit}>
                <AdminSectionTitle title="Создать тест" />
                <TextInput label="Название" value={props.title} onChange={props.onTitleChange} required />
                <TextArea label="Описание" value={props.description} onChange={props.onDescriptionChange} />
                <SelectInput
                    label="Тип"
                    value={props.type}
                    onChange={(value) => props.onTypeChange(value as TestType)}
                    options={TEST_TYPES}
                />
                <SelectInput
                    label="Уровень"
                    value={props.grade}
                    onChange={props.onGradeChange}
                    options={GRADES}
                    placeholder="Без уровня"
                />
                <SelectInput
                    label="Тема"
                    value={props.topicId}
                    onChange={props.onTopicChange}
                    options={props.topics.map((topic) => ({
                        value: String(topic.id),
                        label: topic.title,
                    }))}
                    placeholder="Без темы"
                />
                <SelectInput
                    label="Направление подготовки"
                    value={props.learningTrackId}
                    onChange={props.onLearningTrackChange}
                    options={props.learningTracks.map((track) => ({
                        value: String(track.id),
                        label: track.title,
                    }))}
                    placeholder="Без направления"
                />
                <SubmitButton isSubmitting={props.isSubmitting}>Создать тест</SubmitButton>
            </form>

            <AdminEntityList
                title="Текущие тесты"
                emptyText="Тесты не найдены"
                items={props.tests.map((test) => ({
                    id: test.id,
                    title: test.title,
                    description: [test.type, test.grade, test.topicTitle]
                        .filter(Boolean)
                        .join(" · ") || test.description,
                    onDelete: () => props.onDelete(test),
                }))}
            />
        </div>
    )
}

function QuestionsAdminPanel(props: {
    tests: TestResponse[]
    topics: Topic[]
    questions: QuestionResponse[]
    testId: string
    topicId: string
    subtopic: string
    grade: Grade
    text: string
    serialNumber: string
    isSubmitting: boolean
    onTestChange: (value: string) => void
    onTopicChange: (value: string) => void
    onSubtopicChange: (value: string) => void
    onGradeChange: (value: Grade) => void
    onTextChange: (value: string) => void
    onSerialNumberChange: (value: string) => void
    onDelete: (question: QuestionResponse) => void
    onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
    return (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
            <form className="space-y-4" onSubmit={props.onSubmit}>
                <AdminSectionTitle title="Создать вопрос" />
                <SelectInput
                    label="Тест"
                    value={props.testId}
                    onChange={props.onTestChange}
                    options={props.tests.map((test) => ({
                        value: String(test.id),
                        label: test.title,
                    }))}
                    placeholder="Выберите тест"
                    required
                />
                <SelectInput
                    label="Тема"
                    value={props.topicId}
                    onChange={props.onTopicChange}
                    options={props.topics.map((topic) => ({
                        value: String(topic.id),
                        label: topic.title,
                    }))}
                    placeholder="Выберите тему"
                    required
                />
                <TextInput label="Подтема" value={props.subtopic} onChange={props.onSubtopicChange} />
                <SelectInput
                    label="Уровень"
                    value={props.grade}
                    onChange={(value) => props.onGradeChange(value as Grade)}
                    options={GRADES}
                />
                <TextArea label="Формулировка вопроса" value={props.text} onChange={props.onTextChange} required />
                <TextInput
                    label="Порядковый номер"
                    type="number"
                    min={1}
                    value={props.serialNumber}
                    onChange={props.onSerialNumberChange}
                    required
                />
                <SubmitButton isSubmitting={props.isSubmitting}>Создать вопрос</SubmitButton>
            </form>

            <AdminEntityList
                title="Вопросы выбранного теста"
                emptyText="Выберите тест или добавьте вопрос"
                items={props.questions.map((question) => ({
                    id: question.id,
                    title: question.wordingQuestion,
                    description: `#${question.serialNumber} · ${question.subtopic ?? `Тема ${question.topicId}`}`,
                    onDelete: () => props.onDelete(question),
                }))}
            />
        </div>
    )
}

function AnswersAdminPanel(props: {
    tests: TestResponse[]
    questions: QuestionResponse[]
    answers: AnswerGetResponse[]
    selectedQuestion?: QuestionResponse
    testId: string
    questionId: string
    text: string
    isCorrect: boolean
    explanation: string
    isSubmitting: boolean
    onTestChange: (value: string) => void
    onQuestionChange: (value: string) => void
    onTextChange: (value: string) => void
    onCorrectChange: (value: boolean) => void
    onExplanationChange: (value: string) => void
    onDelete: (answer: AnswerGetResponse) => void
    onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
    return (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
            <form className="space-y-4" onSubmit={props.onSubmit}>
                <AdminSectionTitle title="Создать ответ" />
                <SelectInput
                    label="Тест"
                    value={props.testId}
                    onChange={props.onTestChange}
                    options={props.tests.map((test) => ({
                        value: String(test.id),
                        label: test.title,
                    }))}
                    placeholder="Выберите тест"
                    required
                />
                <SelectInput
                    label="Вопрос"
                    value={props.questionId}
                    onChange={props.onQuestionChange}
                    options={props.questions.map((question) => ({
                        value: String(question.id),
                        label: `${question.serialNumber}. ${question.wordingQuestion}`,
                    }))}
                    placeholder="Выберите вопрос"
                    required
                />
                <TextArea label="Текст ответа" value={props.text} onChange={props.onTextChange} required />
                <label className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-700">
                    <input
                        type="checkbox"
                        checked={props.isCorrect}
                        onChange={(event) => props.onCorrectChange(event.target.checked)}
                        className="h-4 w-4 rounded border-slate-300"
                    />
                    Правильный ответ
                </label>
                <TextArea
                    label="Пояснение"
                    value={props.explanation}
                    onChange={props.onExplanationChange}
                />
                <SubmitButton isSubmitting={props.isSubmitting}>Создать ответ</SubmitButton>
            </form>

            <AdminEntityList
                title={props.selectedQuestion ? "Ответы выбранного вопроса" : "Ответы"}
                emptyText="Выберите вопрос или добавьте ответ"
                items={props.answers.map((answer) => ({
                    id: answer.id,
                    title: answer.text,
                    description: answer.isCorrect ? "Правильный" : "Неправильный",
                    onDelete: () => props.onDelete(answer),
                }))}
            />
        </div>
    )
}

function MaterialsAdminPanel(props: {
    topics: Topic[]
    title: string
    description: string
    topicId: string
    subtopic: string
    level: Grade
    fileName: string
    materials: MaterialGetResponse[]
    isMaterialsLoading: boolean
    isSubmitting: boolean
    onTitleChange: (value: string) => void
    onDescriptionChange: (value: string) => void
    onTopicChange: (value: string) => void
    onSubtopicChange: (value: string) => void
    onLevelChange: (value: Grade) => void
    onFileChange: (file: File | null) => void
    onDelete: (material: MaterialGetResponse) => void
    onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
    return (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
            <form className="space-y-4" onSubmit={props.onSubmit}>
                <AdminSectionTitle title="Создать материал" />
                <TextInput label="Название" value={props.title} onChange={props.onTitleChange} required />
                <TextArea label="Описание" value={props.description} onChange={props.onDescriptionChange} />
                <SelectInput
                    label="Тема"
                    value={props.topicId}
                    onChange={props.onTopicChange}
                    options={props.topics.map((topic) => ({
                        value: String(topic.id),
                        label: topic.title,
                    }))}
                    placeholder="Выберите тему"
                    required
                />
                <TextInput label="Подтема" value={props.subtopic} onChange={props.onSubtopicChange} />
                <SelectInput
                    label="Уровень"
                    value={props.level}
                    onChange={(value) => props.onLevelChange(value as Grade)}
                    options={GRADES}
                />
                <label className="block">
                    <span className="mb-2 block text-xs font-medium uppercase text-slate-500">
                        Файл
                    </span>
                    <input
                        type="file"
                        required
                        onChange={(event) => props.onFileChange(event.target.files?.[0] ?? null)}
                        className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm shadow-slate-950/5 file:mr-4 file:rounded-md file:border-0 file:bg-slate-950 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:border-slate-400 focus:border-slate-500 focus:outline-none"
                    />
                    {props.fileName && (
                        <span className="mt-2 block text-sm text-slate-500">
                            {props.fileName}
                        </span>
                    )}
                </label>
                <SubmitButton isSubmitting={props.isSubmitting}>Создать материал</SubmitButton>
            </form>

            {props.isMaterialsLoading ? (
                <Loader />
            ) : (
                <AdminEntityList
                    title="Материалы"
                    emptyText={
                        props.topicId
                            ? "Материалы по выбранным параметрам не найдены"
                            : "Выберите тему, чтобы загрузить материалы"
                    }
                    items={props.materials.map((material) => ({
                        id: material.id,
                        title: material.title,
                        description: [
                            material.topicTitle,
                            material.subtopic,
                            material.level,
                            material.description,
                        ]
                            .filter(Boolean)
                            .join(" · "),
                        onDelete: () => props.onDelete(material),
                    }))}
                />
            )}
        </div>
    )
}

function AdminSectionTitle({ title }: { title: string }) {
    return <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
}

function TextInput(props: {
    label: string
    value: string
    onChange: (value: string) => void
    type?: string
    min?: number
    required?: boolean
}) {
    return (
        <label className="block">
            <span className="mb-2 block text-xs font-medium uppercase text-slate-500">
                {props.label}
            </span>
            <input
                type={props.type ?? "text"}
                min={props.min}
                value={props.value}
                onChange={(event) => props.onChange(event.target.value)}
                required={props.required}
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 shadow-sm shadow-slate-950/5 transition placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-500 focus:outline-none"
            />
        </label>
    )
}

function TextArea(props: {
    label: string
    value: string
    onChange: (value: string) => void
    required?: boolean
}) {
    return (
        <label className="block">
            <span className="mb-2 block text-xs font-medium uppercase text-slate-500">
                {props.label}
            </span>
            <textarea
                value={props.value}
                onChange={(event) => props.onChange(event.target.value)}
                required={props.required}
                rows={4}
                className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm shadow-slate-950/5 transition placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-500 focus:outline-none"
            />
        </label>
    )
}

function SelectInput(props: {
    label: string
    value: string
    onChange: (value: string) => void
    options: Array<{ value: string; label: string }>
    placeholder?: string
    required?: boolean
}) {
    return (
        <label className="block">
            <span className="mb-2 block text-xs font-medium uppercase text-slate-500">
                {props.label}
            </span>
            <select
                value={props.value}
                onChange={(event) => props.onChange(event.target.value)}
                required={props.required}
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-800 shadow-sm shadow-slate-950/5 transition hover:border-slate-400 focus:border-slate-500 focus:outline-none"
            >
                {props.placeholder && <option value="">{props.placeholder}</option>}
                {props.options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </label>
    )
}

function CheckboxList(props: {
    label: string
    options: Array<{ value: number; label: string }>
    selectedValues: number[]
    onChange: (values: number[]) => void
    emptyText: string
}) {
    function toggleValue(value: number, isChecked: boolean) {
        if (isChecked) {
            props.onChange([...props.selectedValues, value])
            return
        }

        props.onChange(props.selectedValues.filter((selectedValue) => selectedValue !== value))
    }

    return (
        <div>
            <span className="mb-2 block text-xs font-medium uppercase text-slate-500">
                {props.label}
            </span>
            {props.options.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-sm text-slate-500">
                    {props.emptyText}
                </div>
            ) : (
                <div className="max-h-56 space-y-2 overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3">
                    {props.options.map((option) => (
                        <label
                            key={option.value}
                            className="flex items-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-medium text-slate-700"
                        >
                            <input
                                type="checkbox"
                                checked={props.selectedValues.includes(option.value)}
                                onChange={(event) =>
                                    toggleValue(option.value, event.target.checked)
                                }
                                className="h-4 w-4 rounded border-slate-300"
                            />
                            {option.label}
                        </label>
                    ))}
                </div>
            )}
        </div>
    )
}

function SubmitButton({
    children,
    isSubmitting,
}: {
    children: string
    isSubmitting: boolean
}) {
    return (
        <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
            {isSubmitting ? "Сохраняем..." : children}
        </button>
    )
}

function SecondaryButton({
    children,
    onClick,
}: {
    children: string
    onClick: () => void
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
        >
            {children}
        </button>
    )
}

function AdminEntityList({
    title,
    emptyText,
    items,
}: {
    title: string
    emptyText: string
    items: Array<{
        id: number
        title: string
        description?: string
        onEdit?: () => void
        onDelete: () => void
    }>
}) {
    return (
        <div>
            <h2 className="mb-4 text-xl font-semibold text-slate-950">{title}</h2>
            {items.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
                    {emptyText}
                </div>
            ) : (
                <div className="max-h-[640px] space-y-3 overflow-auto pr-1">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="font-semibold text-slate-950">{item.title}</p>
                                    {item.description && (
                                        <p className="mt-2 text-sm leading-6 text-slate-600">
                                            {item.description}
                                        </p>
                                    )}
                                </div>
                                <span className="shrink-0 rounded-full border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-500">
                                    #{item.id}
                                </span>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {item.onEdit && (
                                    <button
                                        type="button"
                                        onClick={item.onEdit}
                                        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
                                    >
                                        Изменить
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={item.onDelete}
                                    className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 transition hover:border-red-300 hover:bg-red-100"
                                >
                                    Удалить
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

function ConfirmDeleteDialog({
    title,
    description,
    isSubmitting,
    onCancel,
    onConfirm,
}: {
    title: string
    description: string
    isSubmitting: boolean
    onCancel: () => void
    onConfirm: () => void
}) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4"
            role="presentation"
            onMouseDown={onCancel}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-dialog-title"
                className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-950/20"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <h2 id="delete-dialog-title" className="text-xl font-semibold text-slate-950">
                    {title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Отмена
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isSubmitting}
                        className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSubmitting ? "Удаляем..." : "Удалить"}
                    </button>
                </div>
            </div>
        </div>
    )
}
