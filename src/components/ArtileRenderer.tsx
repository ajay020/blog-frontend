import { JSX } from 'react';
import { OutputData } from '@editorjs/editorjs';
import { Article } from '@/types/article.types';
import { Clock, Heart } from 'lucide-react';

interface ArticleRendererProps {
    data: OutputData;
    title: string;
    coverImage?: string;
    article?: Article
}

const ArticleRenderer: React.FC<ArticleRendererProps> = ({
    data,
    title,
    coverImage,
    article
}) => {

    const publishedAt = article?.publishedAt ? new Date(article?.publishedAt) : null;


    const renderBlock = (block: any) => {
        switch (block.type) {
            case 'header':
                const HeaderTag = `h${block.data.level}` as keyof JSX.IntrinsicElements;
                return (
                    <HeaderTag className="font-bold my-4 text-gray-900 dark:text-white">
                        {block.data.text}
                    </HeaderTag>
                );

            case 'paragraph':
                return (
                    <p
                        className="text-lg leading-relaxed my-4 text-gray-800 dark:text-gray-200"
                        dangerouslySetInnerHTML={{ __html: block.data.text }}
                    />
                );

            case 'list':
                const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
                const listClass = block.data.style === 'ordered'
                    ? 'list-decimal ml-6 my-4 space-y-2 text-gray-800 dark:text-gray-200'
                    : 'list-disc ml-6 my-4 space-y-2 text-gray-800 dark:text-gray-200';

                return (
                    <ListTag className={listClass}>
                        {block.data.items.map((item: any, index: number) => {
                            // Handle both new format (object with content) and old format (string)
                            const itemText = typeof item === 'object' && item.content
                                ? item.content
                                : typeof item === 'string'
                                    ? item
                                    : '';

                            return (
                                <li
                                    key={index}
                                    className="text-lg leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: itemText }}
                                />
                            );
                        })}
                    </ListTag>
                );

            case 'quote':
                return (
                    <blockquote className="border-l-4 border-gray-400 dark:border-gray-600 pl-4 my-6 italic text-xl text-gray-700 dark:text-gray-300">
                        <p>{block.data.text}</p>
                        {block.data.caption && (
                            <footer className="text-sm mt-2 text-gray-600 dark:text-gray-400">
                                — {block.data.caption}
                            </footer>
                        )}
                    </blockquote>
                );

            case 'code':
                return (
                    <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg my-4 overflow-x-auto">
                        <code className="text-sm text-gray-900 dark:text-gray-100">
                            {block.data.code}
                        </code>
                    </pre>
                );

            case 'delimiter':
                return (
                    <div className="flex justify-center my-8">
                        <div className="flex gap-2">
                            <span className="w-1 h-1 bg-gray-400 dark:bg-gray-600 rounded-full" />
                            <span className="w-1 h-1 bg-gray-400 dark:bg-gray-600 rounded-full" />
                            <span className="w-1 h-1 bg-gray-400 dark:bg-gray-600 rounded-full" />
                        </div>
                    </div>
                );

            case 'image':
                return (
                    <figure className="my-6">
                        <img
                            src={block.data.file.url}
                            alt={block.data.caption || ''}
                            className="w-full rounded-lg"
                        />
                        {block.data.caption && (
                            <figcaption className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                                {block.data.caption}
                            </figcaption>
                        )}
                    </figure>
                );

            case 'embed':
                return (
                    <div className="my-6">
                        <iframe
                            src={block.data.embed}
                            width="100%"
                            height={block.data.height || 400}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="rounded-lg"
                        />
                        {block.data.caption && (
                            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                                {block.data.caption}
                            </p>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <article className="max-w-3xl mx-auto px-4 py-12">
            {/* Cover Image */}
            {coverImage && (
                <img
                    src={coverImage}
                    alt="Cover"
                    className="w-full rounded-lg mb-8 max-h-96 object-cover"
                />
            )}

            {/* Title */}
            <h1 className="text-5xl font-bold mb-8 text-gray-900 dark:text-white">
                {title}
            </h1>

            {/* Metadata */}
            <div className=" flex gap-4 p-4 border-y border-gray-200 dark:border-gray-800">
                <div className='flex items-center gap-1'>
                    <Heart size={14} />
                    {article?.likesCount}
                </div>
                <div className='flex items-center gap-1'>
                    <Clock size={14} /> {article?.readingTime} min
                </div>
                {publishedAt && <span>{publishedAt.toLocaleDateString()}</span>}
            </div>

            {/* Article Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
                {data.blocks.map((block, index) => (
                    <div key={index}>{renderBlock(block)}</div>
                ))}
            </div>
        </article>
    );
};

export default ArticleRenderer;