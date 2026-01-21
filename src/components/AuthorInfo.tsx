import React from 'react'
import { Link } from 'react-router-dom'
import FollowButton from './FollowButton'
import { Article } from '@/types/article.types'

function AuthorInfo({ article }: { article: Article }) {
    return (
        <div className=" flex items-center justify-start gap-3 mb-4">
            <Link to={`/users/${article.author._id}`}>
                <img
                    src={article.author.avatar}
                    className="w-10 h-10 rounded-full border border-gray-200 hover:border-gray-600"
                />
            </Link>
            <p className="font-medium">{article.author.name}</p>
            <FollowButton
                userId={article.author._id}
                className=' bg-transparent border border-gray-700 rounded-3xl p-2'
            />
        </div>
    )
}

export default AuthorInfo