import { Button, Icon } from 'semantic-ui-react';
import React, { useState } from 'react'

const ToggleView = ({ setListMode }) => {

    const [mode, setMode] = useState(true);

    const toggleListMode = (evt) => {
        const value = evt.target.getAttribute('data-value') === '1';
        setListMode(value);
        setMode(value)
    }

    return (
        <Button.Group>
            <Button toggle icon onClick={toggleListMode} color={mode ? 'teal' : null} data-value='1'>
                <Icon name='list layout' data-value='1' />
            </Button>
            <Button toggle icon onClick={toggleListMode} color={!mode ? 'teal' : null} data-value='0'>
                <Icon name='grid layout' data-value='0' />
            </Button>
        </Button.Group>
    );
}


export default ToggleView;