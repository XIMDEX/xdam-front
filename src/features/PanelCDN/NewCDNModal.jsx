import React, { useEffect, useRef, useState } from 'react'
import {  Grid, TextField, styled } from '@material-ui/core';
import MainService from '../../api/service';
import Modal from '../Resources/Modals/Modal/Modal';

const StyledTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: 'teal',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: 'teal',
    },
    '& .MuiOutlinedInput-root': {
        '&:hover fieldset': {
        borderColor: 'teal',
        },
        '&.Mui-focused fieldset': {
        borderColor: 'teal',
        },
    },
})


const NewCDNModal = ({triggerButton}) => {
    const [cdnNameInput, setCDNNameInput] = useState('')
    const [disableSuccess, setDisableSuccess] = useState(true)
    const [disableCancel, setDisableCancel] = useState(false)
    const [open, setOpen] = useState(false)


    const handleCloseModal = ()  => {
        setCDNNameInput('')
        setOpen(false)
    }

    const handleSuccess = (evt) => {
        evt.preventDefault()
        setDisableCancel(true)
        setDisableSuccess(true)
        addNewCDN()
    }

    const handleOnChange = (evt) => {
        setCDNNameInput(evt.target.value)
        if(cdnNameInput === '') setDisableSuccess(true)
        else setDisableSuccess(false)
    }


    const addNewCDN = async () => {

        try{
           const res = await MainService().createCDN(cdnNameInput)

            if (res.created) {
                alert('CDN created successfully')
            }

            setCDNNameInput('')
            setOpen(false)
        } catch(error) {
            alert('Network error, please contact with your proveedor')
            console.error(error)
        } finally {
            setDisableCancel(false)
            setDisableSuccess(true)
        }
    }



    return (
        <Modal
            triggerIcon={triggerButton}
            open={open}
            title={'Create new CDN'}
            content={(
                <Grid key='form-add'  container spacing={3}>
                    <Grid item xs={12}>
                        <StyledTextField
                            fullWidth
                            label={'CDN name'}
                            variant="outlined"
                            size="medium"
                            defaultValue={cdnNameInput}
                            type='text'
                            required
                            onChange={handleOnChange}
                        />
                    </Grid>
                </Grid>
            )}
            onClose={handleCloseModal}
            onCancel={handleCloseModal}
            onSuccess={handleSuccess}
            disableSuccess={disableSuccess}
            disableCancel={disableCancel}
        />
    )
}

export default NewCDNModal
