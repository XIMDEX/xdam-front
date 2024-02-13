import React from 'react';
import { XTag } from '@ximdex/xui-react/material';
import MediaBox from './mediaData/MediaBox';
import TextBox from './mediaData/TextBox';

const MediaData = (props) => {
    const src = props.url
    const tag = {
        id: "demo1",
        label: "Demo Tag 1",
        vocabulary: "VOCABULARY",
        description: "DESCRIPTION",
        type: "TYPE",
        link: "LINK"
      }

    return (
        <div style={{"display":"flex","padding":"1rem","justifyContent":"center","flexDirection":"column","margin":"auto","borderWidth":"8px",}}>
            <MediaBox src={src} />
            {props.description && <TextBox title="description" text="lorem"  />}
            {props.transcription && <TextBox title="transcription" text="lorem"  />}
            {props.xtags && <div style={{"borderTop":"2px solid #eaeaea","padding":"4px","display":"flex","justifyContent":"center","flexDirection":"column","gap":"0.5rem"}}>
                <label style={{"fontWeight":"bold"}}>XTAGS</label>
                <div style={{"display":"flex","flexWrap":"wrap"}}>
                <XTag
                    key={'v2_' + 1 + '_' + 1}
                    tag={tag}
                    customizable={{custom: {
                        color: 'red'
                    }}}
                 />
                  <XTag
                    key={'v2_' + 11 + '_' + 1}
                    tag={tag}
                    customizable={{custom: {
                        color: 'red'
                    }}}
                 />
                  <XTag
                    key={'v2_' + 12 + '_' + 1}
                    tag={tag}
                    customizable={{custom: {
                        color: 'red'
                    }}}
                 />
                  <XTag
                    key={'v2_' + 13 + '_' + 1}
                    tag={tag}
                    customizable={{custom: {
                        color: 'red'
                    }}}
                 />
                  <XTag
                    key={'v2_' + 14 + '_' + 1}
                    tag={tag}
                    customizable={{custom: {
                        color: 'red'
                    }}}
                 />
                </div>
                
            </div>}
        </div>
    )
}
export default MediaData