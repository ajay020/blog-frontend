import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
    followUser,
    unfollowUser,
    checkIsFollowing,
    selectIsFollowing,
    selectFollowLoading,
} from '../features/follow/followSlice';
import { selectUser } from '../features/auth/authSlice';

interface FollowButtonProps {
    userId: string;
    className?: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({ userId, className = '' }) => {
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector(selectUser);
    const isFollowing = useAppSelector(selectIsFollowing);
    const isLoading = useAppSelector(selectFollowLoading);

    useEffect(() => {
        if (currentUser && userId !== currentUser._id) {
            dispatch(checkIsFollowing(userId));
        }
    }, [dispatch, userId, currentUser]);

    const handleToggleFollow = async () => {
        if (!currentUser) {
            alert('Please login to follow users');
            return;
        }

        if (isFollowing) {
            await dispatch(unfollowUser(userId));
        } else {
            await dispatch(followUser(userId));
        }
    };

    // Don't show button if viewing own profile
    if (!currentUser || currentUser._id === userId) {
        return null;
    }

    return (
        <button
            onClick={handleToggleFollow}
            disabled={isLoading}
            className={`flex items-center
                 text-gray-900 dark:text-white border-gray-100
                  hover:border-gray-900 gap-2 px-4 rounded-full 
                  transition disabled:opacity-50 disabled:cursor-not-allowed 
                ${className}`
            }
        >
            {
                isFollowing ? "Following" : "Follow"
            }
        </button>
    );
};

export default FollowButton;