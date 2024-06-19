import React, { useRef, useState } from 'react'
import {  Grid, IconButton, styled, TextField } from '@material-ui/core';
import { useDispatch, useSelector  } from 'react-redux';
import {  reloadCatalogue, selectWorkspaceCollections, selectWorkspacesData, setSchemas, setWorkspacesData } from '../../../appSlice';
import PostAddRounded from '@material-ui/icons/PostAddRounded';
import Modal from '../../Resources/Modals/Modal/Modal';
import { CustomToggle } from '../../Resources/Modals/DynamicFormTemplates/CustomFields';
import MainService from '../../../api/service';
import { selectCollection, selectOrganization } from '../../../slices/organizationSlice';
import { parseWorkspace } from '../../../api/providers/workspacesProvider';

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


const AddOrEditItemFacet = ({facet, requestOpts, values = {}, ...props}) => {
    const [disableSuccess, setDisableSuccess] = useState(true)
    const [disableCancel, setDisableCancel] = useState(false)
    const organization_id = useSelector(selectOrganization)
    const collection_id = useSelector(selectCollection)
    const [open, setOpen] = useState(false)
    const [form, setForm] = useState({});
    const formRef = useRef(null);
    const dispatch = useDispatch()
    const [workspaces, setWorkspaces] = useState(null);
    const workspacesCollections = useSelector(selectWorkspaceCollections)
    const workspacesData = useSelector(selectWorkspacesData)

    const handleCloseModal = ()  => {
        setForm({})
        props.onClose?.()
        setOpen(false)
    }

    const handleSuccess = (evt) => {
        // evt.stopPropagation()
        evt.preventDefault()
        setDisableCancel(true)
        setDisableSuccess(true)
        postNewItem(form)
    }

    const postNewItem = async (data) => {
        if (props?.editForm && facet.count > 0) {
            alert('For edit this item, must be not assigned')
            return;
        }
        try{
            if (facet.key === 'workspaces') {
                data.organization_id = organization_id
            }

            const res = await fetch(facet.route, {...requestOpts, body: JSON.stringify(data)})
            await res.json()

            if (facet.key === 'workspaces' && res.ok) {
                alert('Workspace created successfully')
                const { data } = await MainService().getWorkspaces([res.id]);
        
                const nextWorkspace = parseWorkspace(data[0]);
                
                dispatch(setWorkspacesData(...data));
            }

            const schemas = await MainService().getSchemas();
            dispatch(reloadCatalogue())
            dispatch(setSchemas(schemas));
            setForm({})
            setOpen(false)
        } catch(error) {
            alert('Network error, please contact with your proveedor')
            console.error(error)
        } finally {
            setDisableCancel(false)
            setDisableSuccess(false)
        }
    }

    const handleChange = (key, value) => {
        let newForm = {...values, ...form, [key]: value}
        if (value === '') {
            delete newForm[key]
        }

        setDisableSuccess(Object.keys(newForm).length === 0)
        // setDisableSuccess(Object.keys(newForm).length !== facet.fields.filter(obj => obj.type === "string").length)
        setForm(newForm)
    }

    return (
        <Modal
            triggerIcon={props.triggerIcon}
            open={open}
            title={`${props.title ?? facet.label}`}
            content={(
                <form ref={formRef} onSubmit={handleSuccess}>
                    <Grid key='form-add'  container spacing={3}>
                            {facet.fields.map((field, index) => {
                                if (facet?.key === 'categories' && field.key === 'type' && !form.hasOwnProperty(field.key)) {
                                    handleChange(field.key, field.value ?? 'course')
                                }
                                if (field.key === 'type') return null
                                if (field.type === 'boolean' && field.key === 'is_default') return null
                                if (field.type === 'boolean' && field.key !== 'is_default') {
                                    return (
                                        <Grid item style={{marginRight: 10}}>
                                            <CustomToggle
                                                key={`${field.key}-${index}`}
                                                onChange={value => {
                                                    handleChange(field.key, value)
                                                }}
                                                label={field.label}
                                                required
                                                style={{container:{display: 'flex', flexDirection: 'row', gap: 10}}}
                                            />
                                        </Grid>
                                    )
                                }
                                return (
                                    <Grid item xs={12}>
                                        <StyledTextField
                                            key={`${field.key}-${index}`}
                                            fullWidth
                                            label={field.label}
                                            variant="outlined"
                                            size="medium"
                                            defaultValue={values[field.key]}
                                            type={field.type}
                                            placeholder={values[field.key]}
                                            required
                                            disabled={field.key === 'type'}
                                            onChange={(evt) => handleChange(field.key, evt.target.value)}
                                        />
                                    </Grid>
                                )
                            })}
                    </Grid>
                </form>
            )}
            onClose={handleCloseModal}
            onCancel={handleCloseModal}
            onSuccess={handleSuccess}
            disableSuccess={disableSuccess}
            disableCancel={disableCancel}
        />
    )
}

export default AddOrEditItemFacet
