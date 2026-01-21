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
import { UserPlus, UserMinus } from 'lucide-react';

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
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed 
                ${isFollowing
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                    : 'text-black hover:text-gray-600'
                } ${className}`
            }
        >
            {
                isFollowing ? (
                    <>
                        <UserMinus className="w-4 h-4" />
                        Following
                    </>
                ) : (
                    <>
                        <UserPlus className="w-4 h-4" />
                        Follow
                    </>
                )}
        </button>
    );
};

export default FollowButton;