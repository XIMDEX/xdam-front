import React from 'react';
import { XTag } from '@ximdex/xui-react/material';
import MediaBox from './mediaData/MediaBox';
import TextBox from './mediaData/TextBox';
import XtagBox from './mediaData/XtagBox';

const MediaData = ({description,transcription,url,xtags}) => {
    const src = url
    const tags = [{
        id: "demo1",
        label: "Demo Tag 1",
        vocabulary: "VOCABULARY",
        description: "DESCRIPTION",
        type: "TYPE",
        link: "LINK"
    }]
    return (
        <div style={{"display":"flex","padding":"1rem","justifyContent":"center","flexDirection":"column","margin":"auto","borderWidth":"8px",}}>
            <MediaBox src={src} />
            {description && <TextBox title="description" text={description}  />}
            {transcription && <TextBox title="transcription" text={transcription}  />}
            {tags && <XtagBox xtags={tags}/>}
        </div>
    )
}
export default MediaData