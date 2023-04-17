import React from 'react';
import { Helmet } from 'react-helmet';
import { API_BASE_URL  } from '../../../constants';

import './ImageView.css';

const ImageView = ({ url }) => {

    const imageUrl = API_BASE_URL + '/resource/render/' + url;

    return (
        <div className='image-container'>
            <Helmet>
                <meta property="og:type" content="website" />
                <meta name="twitter:title" content="Open Ximdex" />
                <meta name="twitter:description" content="xdam" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:image" content={imageUrl}></meta>
            </Helmet>
            <img src={imageUrl} alt="Image to share" />
        </div>
    );
};

export default ImageView;