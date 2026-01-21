import api from './api';
import {
    LoginCredentials,
    RegisterCredentials,
    UpdateProfileData,
    UpdatePasswordData,
    AuthResponse,
    User,
} from '@/types/auth.types';

class AuthService {
    // Register new user
    async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/register', credentials);

        // Store token and user in localStorage
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response.data;
    }

    // Login user
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/login', credentials);

        // Store token and user in localStorage
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response.data;
    }

    // Logout user
    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    // Get current user profile
    async getMe(): Promise<{ success: boolean; data: User }> {
        const response = await api.get<{ success: boolean; data: User }>('/auth/me');

        // Update user in localStorage
        if (response.data.data) {
            localStorage.setItem('user', JSON.stringify(response.data.data));
        }

        return response.data;
    }

    // Update user profile
    async updateProfile(data: UpdateProfileData): Promise<{ success: boolean; data: User }> {
        const response = await api.put<{ success: boolean; data: User }>(
            '/auth/updatedetails',
            data
        );

        // Update user in localStorage
        if (response.data.data) {
            localStorage.setItem('user', JSON.stringify(response.data.data));
        }

        return response.data;
    }

    // Update password
    async updatePassword(data: UpdatePasswordData): Promise<AuthResponse> {
        const response = await api.put<AuthResponse>('/auth/updatepassword', data);

        // Update token if returned
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }

        return response.data;
    }

    // Delete account
    async deleteAccount(): Promise<{ success: boolean; message: string }> {
        const response = await api.delete<{ success: boolean; message: string }>('/auth/account');

        // Clear localStorage after successful deletion
        this.logout();

        return response.data;
    }

    // Get user from localStorage
    getUserFromStorage(): User | null {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    // Get token from localStorage
    getTokenFromStorage(): string | null {
        return localStorage.getItem('token');
    }

    // Check if user is authenticated
    isAuthenticated(): boolean {
        return !!this.getTokenFromStorage();
    }
}

export default new AuthService();