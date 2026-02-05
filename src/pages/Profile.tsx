import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
    selectUser,
    selectAuthLoading,
    updateProfile,
} from '../features/auth/authSlice';
import {
    getMyArticles,
    selectMyArticles,
    selectArticlesLoading
} from '../features/articles/articleSlice';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import uploadService from '../services/upload.service';
import { Camera, Mail, Globe, Twitter, Github, Linkedin, Edit2 } from 'lucide-react';

const Profile = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const authLoading = useAppSelector(selectAuthLoading);
    const myArticles = useAppSelector(selectMyArticles);
    const articlesLoading = useAppSelector(selectArticlesLoading);

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        bio: user?.bio || '',
        website: user?.website || '',
        twitter: user?.twitter || '',
        github: user?.github || '',
        linkedin: user?.linkedin || '',
    });
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');

    useEffect(() => {
        dispatch(getMyArticles());
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                bio: user.bio || '',
                website: user.website || '',
                twitter: user.twitter || '',
                github: user.github || '',
                linkedin: user.linkedin || '',
            });
            setAvatarPreview(user.avatar || '');
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let avatarUrl = user?.avatar;

        // Upload avatar if changed
        if (avatarFile) {
            try {
                const result = await uploadService.uploadImage(avatarFile);
                avatarUrl = result.data.url;
            } catch (error) {
                console.error('Avatar upload failed:', error);
                alert('Failed to upload avatar');
                return;
            }
        }

        const result = await dispatch(
            updateProfile({
                ...formData,
                avatar: avatarUrl,
            })
        );

        if (updateProfile.fulfilled.match(result)) {
            setIsEditing(false);
            alert('Profile updated successfully!');
        }
    };

    const publishedArticles = myArticles.filter(a => a.status === 'published');
    const draftArticles = myArticles.filter(a => a.status === 'draft');

    if (!user) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-gray-600 dark:text-gray-400">Please login to view your profile</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-5xl mx-auto px-4 py-12">
                {/* Profile Header */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 ">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Avatar */}
                        <div className="flex flex-col items-center">
                            <div className="relative">
                                <img
                                    src={avatarPreview || '/default-avatar.png'}
                                    alt={user.name}
                                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
                                />
                                {isEditing && (
                                    <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition">
                                        <Camera className="w-5 h-5 text-white" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                            <div className="mt-4 text-center">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {user.articlesCount || myArticles.length} Articles
                                </p>
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1">
                            {!isEditing ? (
                                <>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                                {user.name}
                                            </h1>
                                            <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                                <Mail className="w-4 h-4" />
                                                {user.email}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            Edit Profile
                                        </button>
                                    </div>

                                    {user.bio && (
                                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                                            {user.bio}
                                        </p>
                                    )}

                                    {/* Social Links */}
                                    <div className="flex flex-wrap gap-4">
                                        {user.website && (
                                            <a
                                                href={user.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                                            >
                                                <Globe className="w-4 h-4" />
                                                Website
                                            </a>
                                        )}
                                        {user.twitter && (
                                            <a
                                                href={`https://twitter.com/${user.twitter}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                                            >
                                                <Twitter className="w-4 h-4" />
                                                Twitter
                                            </a>
                                        )}
                                        {user.github && (
                                            <a
                                                href={`https://github.com/${user.github}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                                            >
                                                <Github className="w-4 h-4" />
                                                GitHub
                                            </a>
                                        )}
                                        {user.linkedin && (
                                            <a
                                                href={user.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                                            >
                                                <Linkedin className="w-4 h-4" />
                                                LinkedIn
                                            </a>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <Input
                                        label="Name"
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                            Bio
                                        </label>
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            rows={3}
                                            placeholder="Tell us about yourself..."
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-colors"
                                        />
                                    </div>

                                    <Input
                                        label="Website"
                                        type="url"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleChange}
                                        placeholder="https://yourwebsite.com"
                                    />

                                    <Input
                                        label="Twitter Username"
                                        type="text"
                                        name="twitter"
                                        value={formData.twitter}
                                        onChange={handleChange}
                                        placeholder="@username"
                                    />

                                    <Input
                                        label="GitHub Username"
                                        type="text"
                                        name="github"
                                        value={formData.github}
                                        onChange={handleChange}
                                        placeholder="username"
                                    />

                                    <Input
                                        label="LinkedIn URL"
                                        type="url"
                                        name="linkedin"
                                        value={formData.linkedin}
                                        onChange={handleChange}
                                        placeholder="https://linkedin.com/in/username"
                                    />

                                    <div className="flex gap-3 pt-4">
                                        <Button type="submit" variant="primary" isLoading={authLoading}>
                                            Save Changes
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() => setIsEditing(false)}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {/* Articles Section */}
                <div className="space-y-6">
                    {/* Tabs */}
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="-mb-px flex space-x-8">
                            <button className="border-b-2 border-blue-600 py-4 px-1 text-sm font-medium text-blue-600">
                                Published ({publishedArticles.length})
                            </button>
                            <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                                Drafts ({draftArticles.length})
                            </button>
                        </nav>
                    </div>

                    {/* Articles List */}
                    {articlesLoading ? (
                        <div className="flex justify-center py-12">
                            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                        </div>
                    ) : publishedArticles.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                You haven`&apos;t published any articles yet.
                            </p>
                            <Link
                                to="/create-article"
                                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Write Your First Article
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {publishedArticles.map((article) => (
                                <Link
                                    key={article._id}
                                    to={`/articles/${article.slug}`}
                                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition group"
                                >
                                    {article.coverImage && (
                                        <img
                                            src={article.coverImage}
                                            alt={article.title}
                                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    )}
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                            {article.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                            {article.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                                            <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                                            <div className="flex gap-3">
                                                <span>❤️ {article.likesCount}</span>
                                                <span>👁️ {article.views}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;