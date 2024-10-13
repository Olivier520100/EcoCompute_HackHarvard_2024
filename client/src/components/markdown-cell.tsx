import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import TextareaAutosize from 'react-textarea-autosize';

export default function MarkdownCell() {
  // State to manage the markdown content and edit mode
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Toggle between edit and view mode on double-click
  const handleDoubleClick = () => {
    setIsEditing(!isEditing);
  };

  // Handle content change while editing
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  return (
    <div 
      className="mb-6 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
      onDoubleClick={handleDoubleClick} // Allow editing on double-click
    >
      {isEditing ? (
        <TextareaAutosize
          value={content}
          onChange={handleContentChange}
          className="w-full p-2 border border-gray-300 rounded-md"
          autoFocus
          onBlur={() => setIsEditing(false)} // Exit edit mode when losing focus
        />
      ) : (
        <div>
          <ReactMarkdown className="prose prose-green max-w-none">{content}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};
