export function ErrorLoad(props: { message?: string }) {
    return (
        <div className="rounded-2xl border border-red-300 bg-red-50 p-5 text-center text-red-500">
             {props.message || 'Произошла ошибка при загрузке данных. Пожалуйста, попробуйте позже.'}
        </div>
    )
}