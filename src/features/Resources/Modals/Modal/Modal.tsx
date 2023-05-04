import React, { useEffect, useState } from "react";
import { Button, Grid, Icon, Modal as ModalUI } from "semantic-ui-react";
import { Icon as IconMUI, IconButton } from '@material-ui/core'
import CloseIcon from '@mui/icons-material/Close';

import styles from './Modal.module.scss';


interface ModalProps {
    title?: string|React.ReactElement,
    onSuccess?: (evt: Event) => void,
    onCancel?: (evt: Event) => void,
    onClose: (evt) => void,
    onOpen?: () => void,
    groupButtons?: Array<React.ReactNode|React.ElementType>
    open: boolean,
    disableSuccess?: boolean,
    disableCancel?: boolean,
    contentIsForm?: boolean,
    triggerIcon?: React.ReactNode|React.ElementType,
    content?: React.ReactNode|React.ElementType
}

const Modal = ({  title, content, open, triggerIcon, groupButtons, onSuccess, disableSuccess, onCancel, disableCancel, onClose, onOpen, contentIsForm }: ModalProps) => {

    const [isOpen, setOpen] = useState(false);

    useEffect(() => {
        setOpen(open)
    },[open])

    const handleSuccess = (evt) => {
        onSuccess?.(evt);
        closeModal();
    }

    const handleCancel = (evt) => {
        onCancel?.(evt);
        onClose?.(evt);
        closeModal();
    }

    const closeModal = () => {
        setOpen(false);
    }

    return (
        <div onClick={(evt) => evt.stopPropagation()}>
            <ModalUI
                onClose={handleCancel}
                onOpen={() => {
                    setOpen(true)
                }}
                open={isOpen}
                trigger={triggerIcon}
                // trigger={(<div style={{cursor: 'ponter'}}>{triggerIcon}</div>)}
                openOnTriggerClick
            >
                {title && (
                    <ModalUI.Header>
                        <Grid className={styles.header}>
                            {title}
                            <Button
                                circular
                                compact
                                icon='close'
                                onClick={handleCancel}
                                color="teal"
                                size="mini"
                            />
                        </Grid>
                    </ModalUI.Header>
                )}
                <ModalUI.Content>{content}</ModalUI.Content>
                { (groupButtons || (onSuccess || onCancel)) && (
                    <ModalUI.Actions>
                        {groupButtons && (
                            <Grid className={styles.groupButtons} padded>
                                {groupButtons.map((ButtonElement: React.ReactElement, id) => ButtonElement)}
                            </Grid>
                        )}
                        {!groupButtons && onSuccess && (<Button role="submit"  onClick={handleSuccess} disabled={disableSuccess ?? false} color="teal" className={styles.button}>OK</Button>)}
                        {!groupButtons && onCancel && (<Button onClick={handleCancel} negative disabled={disableCancel ?? false} className={styles.button}>CANCEL</Button>)}
                    </ModalUI.Actions>
                )}
            </ModalUI>
        </div>
    )
}

export default Modal;
