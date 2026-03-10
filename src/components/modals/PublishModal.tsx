import { useState, FormEvent } from 'react';
import { X } from 'lucide-react';

interface PublishModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPublish: (data: { tags: string[]; status: 'draft' | 'published' }) => void;
    title: string;
    coverImage?: string | null;
    excerpt?: string;
    isLoading?: boolean;
}

const PublishModal: React.FC<PublishModalProps> = ({
    isOpen,
    onClose,
    onPublish,
    title,
    coverImage,
    excerpt,
    isLoading = false,
}) => {
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState<string[]>([]);

    if (!isOpen) return null;

    const handleAddTag = (e: FormEvent) => {
        e.preventDefault();
        const trimmedTag = tagInput.trim().toLowerCase();

        if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
            setTags([...tags, trimmedTag]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag(e);
        }
    };

    const handlePublish = (status: 'draft' | 'published') => {
        onPublish({ tags, status });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
            <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-gray-900 shadow-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Publish Article
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
                    >
                        <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-6 space-y-6">
                    {/* Preview */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            Story Preview
                        </h3>
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            {coverImage && (
                                <img
                                    src={coverImage}
                                    alt="Cover preview"
                                    className="w-full h-40 object-cover rounded-lg mb-3"
                                />
                            )}
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                {title || 'Untitled'}
                            </h4>
                            {excerpt && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                    {excerpt}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Add Tags (up to 5)
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                            Help readers discover your story by adding relevant tags
                        </p>

                        {/* Tag Input */}
                        <form onSubmit={handleAddTag} className="mb-3">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Add a tag..."
                                disabled={tags.length >= 5}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </form>

                        {/* Tags Display */}
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                                    >
                                        {tag}
                                        <button
                                            onClick={() => handleRemoveTag(tag)}
                                            className="hover:text-blue-900 dark:hover:text-blue-100"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Publishing Note */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                            <strong>Note:</strong> Once published, your article will be visible to everyone.
                            You can save as draft to continue editing later.
                        </p>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-6 py-4 flex justify-end gap-3">
                    <button
                        onClick={() => handlePublish('draft')}
                        disabled={isLoading}
                        className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Save as Draft
                    </button>
                    <button
                        onClick={() => handlePublish('published')}
                        disabled={isLoading}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Publishing...
                            </>
                        ) : (
                            'Publish Now'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PublishModal;