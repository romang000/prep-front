import type { TestResponse } from '../model/types'

type Props = {
    test: TestResponse
    onClick?: () => void
}

export function TestCard({ test, onClick }: Props) {
    return (

        <button
            onClick={onClick}
            className="w-full text-left rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
            <div className="mb-3 flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-800">{test.title}</h3>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                    #{test.id}
                </span>
            </div>

            <p className="text-sm leading-6 text-slate-600">
                {test.description || 'Описание отсутствует'}
            </p>
        </button>
    )
}