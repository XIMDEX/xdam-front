import React, { useEffect, useState } from 'react'
import MainService from '../../api/service';
import Modal from '../Resources/Modals/Modal/Modal';
import { XDropdown } from '@ximdex/xui-react/material';
import { selectUser } from '../../appSlice';
import { useSelector } from 'react-redux';


const AddCollectionModal = ({triggerButton, cdn}) => {
    const user = useSelector(selectUser)
    const [collectionsToAdd, setCollectionsToAdd] = useState([])
    const [collections, setCollections] = useState([])
    const [disableSuccess, setDisableSuccess] = useState(true)
    const [disableCancel, setDisableCancel] = useState(false)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        getCollections()
    }, []);

    const getCollections = () => {
        let collectionsToShow = []
        user?.data.selected_org_data?.collections?.forEach(coll => {
            let obj = {
                value: coll.id,
                label: coll.name
            }
            collectionsToShow.push(obj)
        });
        setCollections(collectionsToShow)
    }

    const handleCloseModal = ()  => {
        setCollectionsToAdd([])
        setOpen(false)
    }

    const handleSuccess = (evt) => {
        evt.preventDefault()
        setDisableCancel(true)
        setDisableSuccess(true)
        addCollectionToCDN()
    }

    const handleOnChange = (values) => {
        const valuesArray = values.map( value => value.value)

        const valuesOptionsArray = valuesArray.map((collection) => {
            return collections.find(option => option.value === collection)
        })
        setCollectionsToAdd(valuesOptionsArray)
        if(valuesOptionsArray.length > 0) setDisableSuccess(false)
    }


    const addCollectionToCDN = async () => {
        let collectionIDs = collectionsToAdd.map(coll => coll.value)
        try{
           const res = await MainService().addCollectionsToCDN(cdn.id, collectionIDs)
            if (res.created) {
                alert('CDN created successfully')
            }

            setCollectionsToAdd([])
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
            title={`Add collections to ${cdn.name}`}
            content={(
                <XDropdown
                    onChange={(e, values) => handleOnChange(values)}
                    value={collectionsToAdd}
                    options={collections}
                    multiple={true}
                    hasCheckboxes={true}
                    labelOptions='label'
                    label='Select collections'
                    width='100%'
                    bgColor='100'
                    size='small'
                />
            )}
            onClose={handleCloseModal}
            onCancel={handleCloseModal}
            onSuccess={handleSuccess}
            disableSuccess={disableSuccess}
            disableCancel={disableCancel}
        />
    )
}

export default AddCollectionModal
