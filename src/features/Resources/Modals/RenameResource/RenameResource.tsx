import React, { useState } from "react";
import { Button, Icon, Input, Modal } from "semantic-ui-react";
import { useDispatch } from "react-redux";
import { reloadCatalogue } from "../../../../appSlice";
import styles from './RenameResource.module.scss';

const MINIMUM_NAME_LENGTH = 3;

const RenameResource = ({ workspaces, currentName, action, hiddeEditButton }: {workspaces: any, currentName: string, action: (newName: string) => void, hiddeEditButton: () => void }) => {
    const [open, setOpen] = useState(false);
    const [newName, setNewName] = useState<string>('');

    const dispatch = useDispatch();

    const saveNewName = () => {
        action(newName);
        closeModal();
    }

    const cannotSave = (): boolean => {
        const existWorkspaceName = workspaces?.filter(wks => wks.name === newName)[0]
        return newName.length < MINIMUM_NAME_LENGTH || currentName === newName || !existWorkspaceName;
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
                <Input size='massive' disabled={newName === null} value={newName} placeholder={currentName} onChange={updateNewName} className={styles.workspaceRenameModal__workspaceNameInput} />
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

export default RenameResource;
