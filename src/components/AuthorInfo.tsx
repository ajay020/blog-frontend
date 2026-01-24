import React from 'react'
import { Link } from 'react-router-dom'
import FollowButton from './FollowButton'
import { Article } from '@/types/article.types'

function AuthorInfo({ article, showFollowBtn }: { article: Article, showFollowBtn?: boolean }) {
    return (
        <div className=" flex items-center justify-start gap-4 mb-4">
            <Link
                className='flex gap-2 items-center'
                to={`/users/${article.author._id}`}
            >
                <img
                    src={article.author.avatar}
                    className="w-10 h-10 rounded-full border border-gray-200 hover:border-gray-600"
                />
                <p className="font-medium text-black hover:text-gray-600">{article.author.name}</p>
            </Link>
            {showFollowBtn && <FollowButton
                userId={article.author._id}
                className=' bg-transparent border border-gray-600 rounded-full p-2'
            />}
        </div>
    )
}

export default AuthorInfo