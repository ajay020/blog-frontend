// src/services/upload.service.ts

import api from "./api"

interface UploadResponse {
    success: boolean;
    data: {
        url: string;
        publicId: string;
    };
}

class UploadService {
    // Upload image file (multipart/form-data)
    async uploadImage(file: File): Promise<UploadResponse> {
        const formData = new FormData();
        formData.append('image', file);

        // console.log("file", file)

        const response = await api.post<UploadResponse>('/upload/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    }

    // Upload multiple images
    async uploadImages(files: File[]): Promise<{ success: boolean; data: Array<{ url: string; publicId: string }> }> {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('images', file);
        });

        const response = await api.post('/upload/images', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    }

    // Upload base64 image
    async uploadBase64(base64Image: string): Promise<UploadResponse> {
        const response = await api.post<UploadResponse>('/upload/base64', {
            image: base64Image,
        });

        return response.data;
    }

    // Delete image
    async deleteImage(publicId: string): Promise<{ success: boolean; message: string }> {
        const response = await api.delete(`/upload/image/${publicId}`);
        return response.data;
    }

    // Convert file to base64
    fileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
}

export default new UploadService();