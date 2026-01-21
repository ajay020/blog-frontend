import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
    selectUser,
    selectAuthLoading,
    updatePassword,
    deleteAccount,
    logout,
} from '../features/auth/authSice2';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import { Lock, LogOut, Trash2, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector(selectUser);
    const isLoading = useAppSelector(selectAuthLoading);

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [passwordError, setPasswordError] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value,
        });
        setPasswordError('');
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            return;
        }

        const result = await dispatch(
            updatePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            })
        );

        if (updatePassword.fulfilled.match(result)) {
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
            alert('Password updated successfully!');
        } else {
            setPasswordError('Failed to update password. Check your current password.');
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== 'DELETE') {
            alert('Please type DELETE to confirm');
            return;
        }

        const result = await dispatch(deleteAccount());

        if (deleteAccount.fulfilled.match(result)) {
            navigate('/');
        } else {
            alert('Failed to delete account. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="max-w-3xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    Settings
                </h1>

                {/* Account Info */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        Account Information
                    </h2>
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                            <p className="text-gray-900 dark:text-white font-medium">{user?.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                            <p className="text-gray-900 dark:text-white font-medium">{user?.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Role</p>
                            <p className="text-gray-900 dark:text-white font-medium capitalize">
                                {user?.role}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Change Password */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Lock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Change Password
                        </h2>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        {passwordError && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                                <p className="text-sm text-red-600 dark:text-red-400">{passwordError}</p>
                            </div>
                        )}

                        <Input
                            label="Current Password"
                            type="password"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            required
                        />

                        <Input
                            label="New Password"
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            required
                        />

                        <Input
                            label="Confirm New Password"
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            required
                        />

                        <Button type="submit" variant="primary" isLoading={isLoading}>
                            Update Password
                        </Button>
                    </form>
                </div>

                {/* Logout */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Logout
                        </h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Sign out of your account on this device
                    </p>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                        Logout
                    </button>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                        <h2 className="text-xl font-bold text-red-600 dark:text-red-400">
                            Danger Zone
                        </h2>
                    </div>

                    {!showDeleteConfirm ? (
                        <>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Once you delete your account, there is no going back. This will:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-1">
                                <li>Delete all your articles permanently</li>
                                <li>Delete all your images from cloud storage</li>
                                <li>Remove all your data from our servers</li>
                                <li>Cannot be undone</li>
                            </ul>
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                                Delete Account
                            </button>
                        </>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex gap-3">
                                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
                                        Warning: This action is irreversible!
                                    </p>
                                    <p className="text-sm text-yellow-700 dark:text-yellow-400">
                                        Type <strong>DELETE</strong> to confirm account deletion
                                    </p>
                                </div>
                            </div>

                            <Input
                                name=""
                                label="Type DELETE to confirm"
                                type="text"
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                                placeholder="DELETE"
                            />

                            <div className="flex gap-3">
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={deleteConfirmText !== 'DELETE' || isLoading}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Deleting...' : 'Confirm Delete'}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowDeleteConfirm(false);
                                        setDeleteConfirmText('');
                                    }}
                                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;