import React from 'react';
import TwitterIcon from '@mui/icons-material/Twitter';

import './TwitterButton.css';

const TwitterButton = ({ text, url }) => {
  const baseUrl = 'https://twitter.com/intent/tweet?';
  const tweetText = `text=${encodeURIComponent(text)}`;
  const tweetUrl = url ? `&url=${encodeURIComponent(url)}` : '';

  const shareUrl = `${baseUrl}${tweetText}${tweetUrl}`;

  return (
    <a href={shareUrl} target="_blank" rel="noopener noreferrer">
      <div className="link-content">
        <TwitterIcon /> 
        <span>Share on Twitter</span>
      </div>
    </a>

  );
};

export default TwitterButton;