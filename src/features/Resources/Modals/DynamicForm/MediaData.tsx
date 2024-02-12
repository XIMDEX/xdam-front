import React from 'react';
import MainService from '../../../../api/service';
import { XTag } from '@ximdex/xui-react/material';

const MediaData = (props) => {
    const src = props.url
    console.log(props.url)
    return (
        <div style={{"display":"flex","padding":"1rem","justifyContent":"center","flexDirection":"column","margin":"auto","borderWidth":"8px",}}>
            <img src={MainService().render(src)} alt="Not Found" style={{"maxHeight":"250px","maxWidth":"250px","margin":"auto"}} />
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
                <XTag
                    name='testing tag'
                    status='correct'
                    onClickRemove={() => console.log("remove")}
                />
            </div>
        </div>
    )
}
export default MediaData