import React from 'react'
import { ArrayFieldTemplate} from "@rjsf/semantic-ui";
import Layout from '../Layout/Layout';
import { Button } from 'semantic-ui-react';

const TagsFieldTemplate = (props) => {

    return (
      <>
        <h3 style={{marginBottom: 25}}>{props.title}{props.canAdd && (
            <Button icon='plus' circular size='mini' color='teal' className='forms-btn-addArrayItem' onClick={props.onAddClick} />
        )}</h3>
        
            {
                props.title !== 'Entities Linked' &&  props.title !== 'Entities Non-Linked' 
                    ? (<ArrayFieldTemplate {...props} />)
                    : (<Layout {...props}/> )
            }
      </>
    )
}
export default TagsFieldTemplate
