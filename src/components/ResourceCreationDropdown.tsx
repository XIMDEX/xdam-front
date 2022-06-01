
import { Button, Dropdown } from 'semantic-ui-react';
import React from 'react'

// const options = [
//     { key: 'batch', icon: 'database', text: 'New batch', value: 'batch', onClick: newBatch },
// ]

const ResourceCreationDropdown = ({options}) =>{
    return (
        <Button.Group color='teal' style={{ marginLeft: 4, borderRadius: '.28571429rem' }}>
            <Dropdown
                className='button icon'
                floating
                options={options}
            />
        </Button.Group>
    )
}

export default ResourceCreationDropdown;