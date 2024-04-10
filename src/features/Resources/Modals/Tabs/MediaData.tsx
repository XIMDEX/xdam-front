import React from 'react';
import MediaBox from './mediaData/MediaBox';
import TextBox from './mediaData/TextBox';
import XtagBox from './mediaData/XtagBox';

const MediaData = ({description,transcription,url,xtags}) => {
    const src = url
    const tags = [ {
        id: "demo1",
        label: "Demo Tag 1",
        vocabulary: "VOCABULARY",
        description: "DESCRIPTION",
        type: "Organization",
        link: "LINK"
      },
      {
        id: "demo2",
        label: "Demo Organization",
        vocabulary: "VOCABULARY",
        description: "DESCRIPTION",
        type: 'Organization',
        link: "LINK"
      },
      {
        id: "demo3",
        label: "Demo Person",
        vocabulary: "VOCABULARY",
        description: "DESCRIPTION",
        type: 'Person',
        link: "LINK"
      },
      {
        id: "demo4",
        label: "Demo Place",
        vocabulary: "VOCABULARY",
        description: "DESCRIPTION",
        type: 'Place',
        link: "LINK"
      },
      {
        id: "demo5",
        label: "Demo Custom",
        vocabulary: "VOCABULARY",
        description: "DESCRIPTION",
        type: 'Place',
        link: "LINK"
      },]
    return (
        <div style={{"display":"flex","justifyContent":"center","flexDirection":"column","margin":"auto","borderWidth":"8px",}}>
            <MediaBox src={src} />
            {description && <TextBox title="description" text={description}  />}
            {transcription && <TextBox title="transcription" text={transcription}  />}
            {tags && <XtagBox xtags={tags}/>}
        </div>
    )
}
export default MediaData