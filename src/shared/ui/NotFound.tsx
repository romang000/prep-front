export function NotFound(props: {message: string}) {
    return (
        <div className="rounded-2xl border border-gray-300 bg-gray-50 p-5 text-center text-gray-500">
            {props.message}
        </div>
    )
}