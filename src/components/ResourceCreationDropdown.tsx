
import { Button, Dropdown } from 'semantic-ui-react';
import React from 'react'

const ResourceCreationControll = ({ children, options, disabled = false }: { children: JSX.Element, options: any[], disabled?: boolean }) =>{

    return (
        <Button.Group color='teal' style={{ marginLeft: 4, borderRadius: '.28571429rem' }}>
        {children}
            <Dropdown
                className='button icon'
                floating
                options={options}
                trigger={<></>}
                disabled={disabled}
            />
        </Button.Group>
    )
}

export default ResourceCreationControll;