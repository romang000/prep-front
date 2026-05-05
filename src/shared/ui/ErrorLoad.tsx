export function ErrorLoad(props: { message?: string }) {
    return (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center text-sm font-medium text-red-700">
             {props.message || 'Произошла ошибка при загрузке данных. Пожалуйста, попробуйте позже.'}
        </div>
    )
}
