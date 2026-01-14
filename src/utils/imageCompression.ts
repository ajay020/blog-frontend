import imageCompression from "browser-image-compression";

export async function compressImage(file: File): Promise<File> {
    const options = {
        maxSizeMB: window.innerWidth < 768 ? 0.6 : 1, // target max size
        maxWidthOrHeight: 1920,  // resize large images
        useWebWorker: true,
    };

    try {
        return await imageCompression(file, options);
    } catch (error) {
        console.error("Image compression failed:", error);
        throw error;
    }
}
