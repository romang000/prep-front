export function NotFound(props: {message: string}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-center text-sm text-slate-500 shadow-sm shadow-slate-950/5">
            {props.message}
        </div>
    )
}
