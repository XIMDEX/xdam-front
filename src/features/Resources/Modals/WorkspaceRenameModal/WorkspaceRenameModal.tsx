import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button, Checkbox, Icon, Input, Message, Modal } from "semantic-ui-react";
import { useDispatch } from "react-redux";
import MainService from "../../../../api/service";
import HttpStatusCode from "../../../../api/HttpStatusCode";
import { selectFacetsQuery, selectOrganization, setFacetsQuery } from "../../../../slices/organizationSlice";
import { reloadCatalogue } from "../../../../appSlice";
import styles from './workspaceRenameModal.module.scss';

const WorkspaceRenameModal = ({ currentName, hiddeEditButton }) => {

    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(null);
    const [needConfirmation, setNeedConfirmation] = useState(false);
    const [forceUpdate, setForceUpdata] = useState(false);
    const [newName, setNewName] = useState<string>('');
    const organizationId = useSelector(selectOrganization);
    const facets = useSelector(selectFacetsQuery);
    const dispatch = useDispatch();

    const saveNewName = () => {

        MainService().updateWorkspace({ organizationId, oldWorkspaceName: currentName, newWorkspaceName: newName, force: forceUpdate })
            .then((response) => {

                if (response.status === HttpStatusCode.UNPROCESSABLE_ENTITY) {
                    setNeedConfirmation(true);
                    
                    setMessage({
                        header: "We have found multiple workspaces with the same name!",
                        content: "Check the option to remane them",
                        color: 'orange',
                        icon: 'warning sign'
                    });
                } else {
                    setMessage({
                        header: "Workspace renamed",
                        content: "",
                        color: 'green',
                        icon: 'thumbs up outline'
                    });


                    if (facets?.workspaces && facets.workspaces.includes(currentName)) {
                        const newFacets = {
                            ...facets,
                            workspaces: [...facets?.workspaces, newName].filter(w => w !== currentName)
                        }

                        dispatch(setFacetsQuery(newFacets));
                    }
                }
            });

    }

    const cannotSave = (): boolean => {
        return newName.length === 0
            || currentName === newName
            || (needConfirmation && !forceUpdate);
    }

    const openModal = () => {
        setOpen(true);
    }

    const closeModal = () => {
        setOpen(false);
        hiddeEditButton();

        dispatch(reloadCatalogue());
    }

    const updateNewName = (event, data) => {
        event.preventDefault();

        setNewName(data.value);
    }

    const changeForceUpdate = () => {
        setForceUpdata(!forceUpdate);
    }

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            trigger={
                <div className={styles.workspaceRenameModal__edit} onClick={openModal}>
                    <Icon name='pencil alternate' size="small" />
                </div>
            }
        >
            <Modal.Header>Edit Workspace Name</Modal.Header>
            <Modal.Content>
                {message !== null &&
                    <div className={styles.workspaceRenameModal__message}>
                        <Modal.Description>
                            <Message
                                size='small'
                                icon={message.icon}
                                color={message.color}
                                header={message.header}
                                content={message.content}
                            />
                        </Modal.Description>
                    </div>
                }
                <Input size='massive' disabled={newName === null} value={newName} placeholder={currentName} onChange={updateNewName} className={styles.workspaceRenameModal__workspaceNameInput} />
                {needConfirmation &&
                    <div className={styles.workspaceRenameModal__confirmation}>
                        <Modal.Description>
                            <Checkbox
                                label='Update all workspaces'
                                checked={forceUpdate}
                                onChange={changeForceUpdate}
                            />
                        </Modal.Description>
                    </div>
                }
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={closeModal}>
                    Cancel
                </Button>
                <Button
                    content="Save"
                    labelPosition='right'
                    icon='save'
                    onClick={saveNewName}
                    color="teal"
                    disabled={cannotSave()}
                />
            </Modal.Actions>
        </Modal>
    )
}

export default WorkspaceRenameModal;