type Props = {
    pageNumber: number
    totalPages: number
    onPrevious: () => void
    onNext: () => void
    isPreviousDisabled?: boolean
    isNextDisabled?: boolean
}

export function Pagination({
    pageNumber,
    totalPages,
    onPrevious,
    onNext,
    isPreviousDisabled = false,
    isNextDisabled = false,
}: Props) {
    return (
        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl bg-white shadow-sm sm:flex-row">
            <div className="p-5 text-sm text-slate-600">
                Страница <span className="font-semibold">{pageNumber + 1}</span>{" "}
                из <span className="font-semibold">{totalPages}</span>
            </div>

            <div className="flex gap-3 p-5">
                <button
                    type="button"
                    onClick={onPrevious}
                    disabled={isPreviousDisabled}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Назад
                </button>

                <button
                    type="button"
                    onClick={onNext}
                    disabled={isNextDisabled}
                    className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Вперёд
                </button>
            </div>
        </div>
    )
}