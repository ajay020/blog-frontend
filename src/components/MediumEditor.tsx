// import React, { useState, useRef, useEffect } from 'react';
// import { Upload, Image, Type, Bold, Italic, List, Link, Code, Quote } from 'lucide-react';

// const MediumEditor = () => {
//     const [title, setTitle] = useState('');
//     const [coverImage, setCoverImage] = useState<any>(null);
//     const [blocks, setBlocks] = useState([
//         { id: 1, type: 'paragraph', content: '', placeholder: 'Tell your story...' }
//     ]);
//     const [activeBlock, setActiveBlock] = useState(null);
//     const [showToolbar, setShowToolbar] = useState(false);
//     const fileInputRef = useRef(null);

//     const blockTypes = [
//         { type: 'paragraph', icon: Type, label: 'Text' },
//         { type: 'heading', icon: Type, label: 'Heading' },
//         { type: 'quote', icon: Quote, label: 'Quote' },
//         { type: 'code', icon: Code, label: 'Code' },
//         { type: 'list', icon: List, label: 'List' },
//     ];

//     const handleImageUpload = (e, blockId = null) => {
//         const file = e.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onload = (event) => {
//                 if (blockId) {
//                     updateBlock(blockId, 'content', event.target?.result);
//                 } else {
//                     setCoverImage(event.target?.result);
//                 }
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     const addBlock = (type = 'paragraph', afterId = null) => {
//         const newBlock = {
//             id: Date.now(),
//             type: type,
//             content: '',
//             placeholder: type === 'heading' ? 'Heading...' : type === 'quote' ? 'Quote...' : 'Start writing...'
//         };

//         if (afterId) {
//             const index = blocks.findIndex(b => b.id === afterId);
//             const newBlocks = [...blocks];
//             newBlocks.splice(index + 1, 0, newBlock);
//             setBlocks(newBlocks);
//         } else {
//             setBlocks([...blocks, newBlock]);
//         }
//     };

//     const updateBlock = (id, field, value) => {
//         setBlocks(blocks.map(block =>
//             block.id === id ? { ...block, [field]: value } : block
//         ));
//     };

//     const deleteBlock = (id) => {
//         if (blocks.length > 1) {
//             setBlocks(blocks.filter(block => block.id !== id));
//         }
//     };

//     const handleKeyDown = (e, blockId) => {
//         if (e.key === 'Enter' && !e.shiftKey) {
//             e.preventDefault();
//             addBlock('paragraph', blockId);
//         } else if (e.key === 'Backspace') {
//             const block = blocks.find(b => b.id === blockId);
//             if (block.content === '') {
//                 e.preventDefault();
//                 deleteBlock(blockId);
//             }
//         }
//     };

//     const insertImageBlock = () => {
//         const newBlock = {
//             id: Date.now(),
//             type: 'image',
//             content: '',
//             placeholder: 'Add image'
//         };
//         setBlocks([...blocks, newBlock]);
//     };

//     const renderBlock = (block) => {
//         const commonClasses = "w-full bg-transparent focus:outline-none text-gray-900 dark:text-gray-100";

//         switch (block.type) {
//             case 'heading':
//                 return (
//                     <input
//                         type="text"
//                         value={block.content}
//                         onChange={(e) => updateBlock(block.id, 'content', e.target.value)}
//                         onKeyDown={(e) => handleKeyDown(e, block.id)}
//                         onFocus={() => setActiveBlock(block.id)}
//                         placeholder={block.placeholder}
//                         className={`${commonClasses} text-3xl font-bold mb-2`}
//                     />
//                 );

//             case 'quote':
//                 return (
//                     <div className="border-l-4 border-gray-400 dark:border-gray-600 pl-4">
//                         <textarea
//                             value={block.content}
//                             onChange={(e) => updateBlock(block.id, 'content', e.target.value)}
//                             onKeyDown={(e) => handleKeyDown(e, block.id)}
//                             onFocus={() => setActiveBlock(block.id)}
//                             placeholder={block.placeholder}
//                             className={`${commonClasses} italic text-lg resize-none`}
//                             rows={2}
//                         />
//                     </div>
//                 );

//             case 'code':
//                 return (
//                     <textarea
//                         value={block.content}
//                         onChange={(e) => updateBlock(block.id, 'content', e.target.value)}
//                         onKeyDown={(e) => handleKeyDown(e, block.id)}
//                         onFocus={() => setActiveBlock(block.id)}
//                         placeholder="// code..."
//                         className={`${commonClasses} font-mono text-sm bg-gray-100 dark:bg-gray-800 p-4 rounded-lg resize-none`}
//                     // rows={4}
//                     />
//                 );

//             case 'list':
//                 return (
//                     <div className="flex gap-2">
//                         <span className="text-gray-600 dark:text-gray-400">•</span>
//                         <input
//                             type="text"
//                             value={block.content}
//                             onChange={(e) => updateBlock(block.id, 'content', e.target.value)}
//                             onKeyDown={(e) => handleKeyDown(e, block.id)}
//                             onFocus={() => setActiveBlock(block.id)}
//                             placeholder="List item"
//                             className={`${commonClasses} flex-1`}
//                         />
//                     </div>
//                 );

//             case 'image':
//                 return (
//                     <div className="my-4">
//                         {block.content ? (
//                             <div className="relative group">
//                                 <img src={block.content} alt="Content" className="w-full rounded-lg" />
//                                 <button
//                                     onClick={() => updateBlock(block.id, 'content', '')}
//                                     className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition"
//                                 >
//                                     Remove
//                                 </button>
//                             </div>
//                         ) : (
//                             <div
//                                 onClick={() => {
//                                     const input = document.createElement('input');
//                                     input.type = 'file';
//                                     input.accept = 'image/*';
//                                     input.onchange = (e) => handleImageUpload(e, block.id);
//                                     input.click();
//                                 }}
//                                 className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition"
//                             >
//                                 <Image className="mx-auto mb-2 text-gray-400" size={32} />
//                                 <p className="text-gray-500 dark:text-gray-400">Click to upload image</p>
//                             </div>
//                         )}
//                     </div>
//                 );

//             default:
//                 return (
//                     <textarea
//                         value={block.content}
//                         onChange={(e) => updateBlock(block.id, 'content', e.target.value)}
//                         onKeyDown={(e) => handleKeyDown(e, block.id)}
//                         onFocus={() => setActiveBlock(block.id)}
//                         placeholder={block.placeholder}
//                         className={`${commonClasses} text-lg leading-relaxed resize-none`}
//                         rows={3}
//                     />
//                 );
//         }
//     };

//     const handlePublish = () => {
//         const article = {
//             title,
//             coverImage,
//             blocks: blocks.filter(b => b.content !== ''),
//             createdAt: new Date().toISOString()
//         };
//         console.log('Publishing article:', article);
//         alert('Article published! Check console for data.');
//     };

//     return (
//         <div className="min-h-screen bg-white dark:bg-gray-900">
//             {/* Header */}
//             <header className="border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
//                 <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
//                     <h1 className="text-xl font-bold text-gray-900 dark:text-white">Your Story</h1>
//                     <div className="flex gap-3">
//                         <button className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
//                             Save Draft
//                         </button>
//                         <button
//                             onClick={handlePublish}
//                             className="px-4 py-2 text-sm bg-green-600 text-white rounded-full hover:bg-green-700 transition"
//                         >
//                             Publish
//                         </button>
//                     </div>
//                 </div>
//             </header>

//             {/* Editor */}
//             <div className="max-w-3xl mx-auto px-4 py-12">
//                 {/* Title */}
//                 <input
//                     type="text"
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                     placeholder="Title"
//                     className="w-full text-5xl font-bold mb-4 bg-transparent focus:outline-none text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600"
//                 />

//                 {/* Cover Image */}
//                 {coverImage ? (
//                     <div className="relative group mb-8">
//                         <img src={coverImage} alt="Cover" className="w-full rounded-lg" />
//                         <button
//                             onClick={() => setCoverImage(null)}
//                             className="absolute top-4 right-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition shadow-lg"
//                         >
//                             Remove
//                         </button>
//                     </div>
//                 ) : (
//                     <div
//                         onClick={() => fileInputRef.current?.click()}
//                         className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 mb-8 text-center cursor-pointer hover:border-blue-500 transition"
//                     >
//                         <Upload className="mx-auto mb-2 text-gray-400" size={32} />
//                         <p className="text-gray-500 dark:text-gray-400">Add a cover image</p>
//                         <input
//                             ref={fileInputRef}
//                             type="file"
//                             accept="image/*"
//                             onChange={handleImageUpload}
//                             className="hidden"
//                         />
//                     </div>
//                 )}

//                 {/* Content Blocks */}
//                 <div className="space-y-4">
//                     {blocks.map((block) => (
//                         <div key={block.id} className="group relative">
//                             {renderBlock(block)}

//                             {/* Block Controls */}
//                             {activeBlock === block.id && (
//                                 <div className="absolute -left-12 top-0 opacity-0 group-hover:opacity-100 transition flex flex-col gap-1">
//                                     <button
//                                         onClick={() => addBlock('paragraph', block.id)}
//                                         className="p-1 text-gray-400 hover:text-blue-500"
//                                         title="Add block"
//                                     >
//                                         +
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     ))}
//                 </div>

//                 {/* Add Block Menu */}
//                 <div className="mt-6 flex flex-wrap gap-2">
//                     {blockTypes.map(({ type, icon: Icon, label }) => (
//                         <button
//                             key={type}
//                             onClick={() => addBlock(type)}
//                             className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:text-blue-500 transition text-gray-600 dark:text-gray-400"
//                         >
//                             <Icon size={16} />
//                             {label}
//                         </button>
//                     ))}
//                     <button
//                         onClick={insertImageBlock}
//                         className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:text-blue-500 transition text-gray-600 dark:text-gray-400"
//                     >
//                         <Image size={16} />
//                         Image
//                     </button>
//                 </div>

//             </div>
//         </div>
//     );
// };

// export default MediumEditor;