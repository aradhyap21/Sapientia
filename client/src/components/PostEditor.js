import React, { useState } from 'react';
import SentimentAnalyzer from './SentimentAnalyzer';

const PostEditor = ({ onSave, initialContent }) => {
  const [postContent, setPostContent] = useState(initialContent || '');

  const handleSave = () => {
    onSave(postContent);
  };

  return (
    <div>
      <textarea
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
        placeholder="Write your post here..."
      />
      
      {/* Add Sentiment Analyzer below the editor */}
      <SentimentAnalyzer content={postContent} />
      
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default PostEditor;