export interface FollowUser {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
}

export interface FollowResponse {
    success: boolean;
    message: string;
    data: {
        followingCount: number;
        followersCount: number;
    };
}

export interface FollowersResponse {
    success: boolean;
    data: FollowUser[];
    count: number;
}

export interface IsFollowingResponse {
    success: boolean;
    data: {
        isFollowing: boolean;
    };
}