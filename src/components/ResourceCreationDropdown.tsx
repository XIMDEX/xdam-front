
import { Button, Dropdown } from 'semantic-ui-react';
import React from 'react'

const ResourceCreationControll = (props) =>{
    return (
        <Button.Group color='teal' style={{ marginLeft: 4, borderRadius: '.28571429rem' }}>
            {props.children}
            <Dropdown
                className='button icon'
                floating
                options={props.options}
                trigger={<></>}
            />
        </Button.Group>
    )
}

export default ResourceCreationControll;