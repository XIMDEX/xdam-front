import React from 'react';
import TwitterIcon from '@mui/icons-material/Twitter';
import { API_BASE_URL  } from '../../../constants';

import './TwitterButton.css';

const TwitterButton = ({ text, url }) => {
  const baseUrl = 'https://twitter.com/intent/tweet?';
  const tweetText = `text=${encodeURIComponent(text)}`;
  const tweetUrl = url ? `&url=${API_BASE_URL}/resource/render/${url}/html` : '';

  const shareUrl = `${baseUrl}${tweetText}${tweetUrl}`;

  return (
    <div>
      <a href={shareUrl} target="_blank" rel="noopener noreferrer">
        <div className="link-content">
          <TwitterIcon /> 
          <span>Share on Twitter</span>
        </div>
      </a>
    </div>

  );
};

export default TwitterButton;