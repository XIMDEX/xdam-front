import React from 'react'
import { ArrayFieldTemplate} from "@rjsf/semantic-ui";
import Layout from '../Layout/Layout';
import { Button } from 'semantic-ui-react';

const Field = (props) => {
    
    return (
      <div>
        <h3 style={{marginBottom: 25}}>{props.title}{props.canAdd && (
            <Button icon='plus' circular size='mini' color='teal' className='forms-btn-addArrayItem' onClick={props.onAddClick} />
        )}</h3>
        
            {
                props.title !== 'Taxon Path' 
                    ? (<ArrayFieldTemplate {...props} canAdd={false}/>)
                    : (<Layout {...props}/> )
            }
      </div>
    )
}
export default Field
