import React from 'react';
import { XTag } from '@ximdex/xui-react/material';
const XtagBox = ({xtags}) => {
    return(
        <div style={{"borderTop":"2px solid #eaeaea","padding":"4px","display":"flex","justifyContent":"center","flexDirection":"column","gap":"0.5rem"}}>
                <label style={{"fontWeight":"bold"}}>XTAGS</label>
                <div style={{"display":"flex","flexWrap":"wrap"}}>
                    {
                        xtags.map((xtag,index)=> 
                            <XTag
                                key={'v2_' + index + '_' + index}
                                tag={xtag}
                                customizable={{custom: {
                                    color: 'red'
                                }}}
                            />
                        )
                    }
                </div>
        </div>
    )
}
export default XtagBox;