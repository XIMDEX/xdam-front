import React from 'react';
import MainService from '../../../../api/service';
import { XTag } from '@ximdex/xui-react/material';

const MediaData = (props) => {
    const src = props.url
    console.log(props.url)
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
            <img src={MainService().render(src)} alt="Not Found" style={{"maxHeight":"250px","margin":"auto","objectFit":"contain"}} />
            <div style={{"borderTop":"2px solid #eaeaea","padding":"4px"}}>
                <label style={{"fontWeight":"bold"}}>Description</label>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Id aspernatur, explicabo quas eos quasi pariatur facere culpa unde a ratione aut commodi. Nemo, accusamus. Nesciunt eligendi delectus ipsam eum officia?</p>
            </div>
            <div style={{"borderTop":"2px solid #eaeaea","padding":"4px"}}>
                <label style={{"fontWeight":"bold"}}>Transcripcion</label>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Id aspernatur, explicabo quas eos quasi pariatur facere culpa unde a ratione aut commodi. Nemo, accusamus. Nesciunt eligendi delectus ipsam eum officia?</p>
            </div>
            <div style={{"borderTop":"2px solid #eaeaea","padding":"4px","display":"flex","justifyContent":"center","flexDirection":"column","gap":"0.5rem"}}>
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
                
            </div>
        </div>
    )
}
export default MediaData