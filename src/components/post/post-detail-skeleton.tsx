const PostDetailsSkeleton = () => (
    <div className="max-w-3xl mx-auto p-4 space-y-4 animate-pulse">
        <div className="h-4 bg-slate-800 rounded w-1/4" />
        <div className="h-8 bg-slate-800 rounded w-3/4" />
        <div className="h-64 bg-slate-800 rounded" />
        <div className="space-y-2">
            <div className="h-4 bg-slate-800 rounded" />
            <div className="h-4 bg-slate-800 rounded w-5/6" />
        </div>
    </div>
);

export default PostDetailsSkeleton