
export interface EditorBlockData {
    // Common fields
    text?: string;
    caption?: string;

    // Header
    level?: number;

    // Code
    code?: string;

    // List
    style?: 'ordered' | 'unordered';
    items?: Array<string | { content: string }>;

    // Image
    file?: {
        url: string;
    };

    // Embed
    embed?: string;
    height?: number;

    // Allow additional properties
    [key: string]: unknown;
}

export interface EditorBlock {
    type: string;
    data: EditorBlockData;
}

export interface EditorOutputData {
    blocks: EditorBlock[];
    time?: number;
    version?: string;
}