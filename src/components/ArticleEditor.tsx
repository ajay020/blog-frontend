import { useEffect, useRef, useState } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Quote from '@editorjs/quote';
import Code from '@editorjs/code';
import Delimiter from '@editorjs/delimiter';
import ImageTool from '@editorjs/image';
import uploadService from '../services/upload.service';
import { CreateArticleData } from '@/types/article.types';
import PublishModal from './PublishModal';

interface ArticleEditorProps {
    initialData?: OutputData;
    initialTitle?: string;
    initialCoverImage?: string | null;
    onSave?: (data: CreateArticleData) => void;
    isLoading?: boolean;
}

interface EditorBlock {
    type: string;
    data: {
        text?: string;
        [key: string]: unknown;
    };
}

interface EditorOutputData {
    blocks: EditorBlock[];
}

const ArticleEditor: React.FC<ArticleEditorProps> = ({
    initialData,
    initialTitle = '',
    initialCoverImage = null,
    onSave,
    isLoading = false,
}) => {
    const editorRef = useRef<EditorJS | null>(null);
    const [title, setTitle] = useState(initialTitle);
    const [coverImage, setCoverImage] = useState<string | null>(initialCoverImage);
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [excerpt, setExcerpt] = useState('');

    // Update state when props change (for edit mode)
    useEffect(() => {
        setTitle(initialTitle);
        setCoverImage(initialCoverImage);
    }, [initialTitle, initialCoverImage]);

    useEffect(() => {
        if (!editorRef.current) {
            const editor = new EditorJS({
                holder: 'editorjs',
                placeholder: 'Tell your story...',
                data: initialData,
                tools: {
                    header: {
                        class: Header as unknown as never,
                        config: {
                            placeholder: 'Enter a header',
                            levels: [1, 2, 3, 4],
                            defaultLevel: 2,
                        },
                    },
                    list: {
                        class: List,
                        inlineToolbar: true,
                    },
                    quote: {
                        class: Quote,
                        inlineToolbar: true,
                    },
                    code: Code,
                    delimiter: Delimiter,
                    image: {
                        class: ImageTool,
                        config: {
                            uploader: {
                                // Upload by file
                                async uploadByFile(file: File) {
                                    try {
                                        const result = await uploadService.uploadImage(file);
                                        return {
                                            success: 1,
                                            file: {
                                                url: result.data.url,
                                            },
                                        };
                                    } catch (error) {
                                        console.error('Upload failed:', error);
                                        return {
                                            success: 0,
                                            file: {
                                                url: '',
                                            },
                                        };
                                    }
                                },
                                // Upload by URL
                                async uploadByUrl(url: string) {
                                    return {
                                        success: 1,
                                        file: { url },
                                    };
                                },
                            },
                        },
                    },
                },
            });

            editorRef.current = editor;
        }

        return () => {
            if (editorRef.current && editorRef.current.destroy) {
                editorRef.current.destroy();
                editorRef.current = null;
            }
        };
    }, [initialData]);

    // Generate excerpt from content
    const generateExcerpt = async () => {
        if (!editorRef.current) return '';

        try {
            const outputData = (await editorRef.current.save()) as EditorOutputData;

            // Find first paragraph
            const firstParagraph = outputData.blocks.find(
                (block) => block.type === 'paragraph' && block.data.text
            );

            if (firstParagraph && firstParagraph.data.text) {
                const text = firstParagraph.data.text.replace(/<[^>]*>/g, '');
                return text.substring(0, 150) + (text.length > 150 ? '...' : '');
            }

            return '';
        } catch (error) {
            console.error('Failed to generate excerpt:', error);
            return '';
        }
    };

    const handlePublishClick = async () => {
        if (!title.trim()) {
            alert('Please add a title to your article');
            return;
        }

        // Generate excerpt for preview
        const generatedExcerpt = await generateExcerpt();
        setExcerpt(generatedExcerpt);

        setShowPublishModal(true);
    };

    const handlePublish = async (publishData: { tags: string[]; status: 'draft' | 'published' }) => {
        if (!editorRef.current) return;

        try {
            const outputData = await editorRef.current.save();

            const article = {
                title,
                coverImage,
                content: outputData,
                tags: publishData.tags,
                status: publishData.status,
            } as CreateArticleData;

            if (onSave) {
                onSave(article);
            }

            setShowPublishModal(false);
        } catch (error) {
            console.error('Saving failed:', error);
            alert('Failed to save article');
        }
    };

    const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                // Upload to Cloudinary
                const result = await uploadService.uploadImage(file);
                setCoverImage(result.data.url);
            } catch (error) {
                console.error('Cover image upload failed:', error);
                alert('Failed to upload cover image');
            }
        }
    };

    return (
        <>
            <div className="min-h-screen bg-white dark:bg-gray-900">
                <header className="border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
                    <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                            Write Your Story
                        </h1>
                        <div className="flex gap-3">
                            <button
                                onClick={() => handlePublish({ tags: [], status: 'draft' })}
                                disabled={isLoading}
                                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition disabled:opacity-50"
                            >
                                Save Draft
                            </button>
                            <button
                                onClick={handlePublishClick}
                                disabled={isLoading}
                                className="px-4 py-2 text-sm bg-green-600 text-white rounded-full hover:bg-green-700 transition disabled:opacity-50"
                            >
                                Publish
                            </button>
                        </div>
                    </div>
                </header>

                <div className="max-w-3xl mx-auto px-4 py-12">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                        className="w-full text-5xl font-bold mb-6 bg-transparent border-none focus:outline-none text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600"
                    />

                    {coverImage ? (
                        <div className="relative group mb-8">
                            <img
                                src={coverImage}
                                alt="Cover"
                                className="w-full rounded-lg max-h-96 object-cover"
                            />
                            <button
                                onClick={() => setCoverImage(null)}
                                className="absolute top-4 right-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition shadow-lg text-sm"
                            >
                                Remove
                            </button>
                        </div>
                    ) : (
                        <div className="mb-8">
                            <label className="block border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition">
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 48 48"
                                >
                                    <path
                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    Click to upload cover image
                                </p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleCoverImageUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    )}

                    <div id="editorjs" className="prose dark:prose-invert max-w-none" />
                </div>
            </div>

            {/* Publish Modal */}
            <PublishModal
                isOpen={showPublishModal}
                onClose={() => setShowPublishModal(false)}
                onPublish={handlePublish}
                title={title}
                coverImage={coverImage}
                excerpt={excerpt}
                isLoading={isLoading}
            />
        </>
    );
};

export default ArticleEditor;