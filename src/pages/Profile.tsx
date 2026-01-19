// src/pages/Profile.tsx
import { FormEvent, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { updateProfile, selectUser, selectAuthLoading } from '../features/auth/authSice2';

const Profile = () => {
    const user = useAppSelector(selectUser);
    const isLoading = useAppSelector(selectAuthLoading);
    const dispatch = useAppDispatch();

    const [formData, setFormData] = useState({
        name: user?.name || '',
        bio: user?.bio || '',
        website: user?.website || '',
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await dispatch(updateProfile(formData));
    };

    return (
        <div>
            <h1>Edit Profile</h1>
            <form onSubmit={handleSubmit}>
                {/* Form fields */}
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
};

export default Profile 