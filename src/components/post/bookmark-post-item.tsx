import React from 'react'
import { BookmarkedPost } from '../../types/post'
import { formatDistanceToNow } from 'date-fns'
import { Link } from 'react-router-dom'

type BookMarkPostItemProps = {
    post: BookmarkedPost
}

export default function BookMarkPostItem({ post }: BookMarkPostItemProps) {
    return (
        <Link to={`/posts/${post._id}`}>
            <div className=' flex flex-col bg-slate-900 p-4 border border-slate-800 rounded-xl '>
                <p className="text-sm font-medium text-white">
                    {post.author.name}
                </p>
                <h3 className="text-lg font-semibold text-white">
                    {post.title}
                </h3>
                <p className="text-xs text-slate-400">
                    {formatDistanceToNow(new Date(post.createdAt))} ago
                </p>
            </div>
        </Link>
    )
}
