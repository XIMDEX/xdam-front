import React, { useState } from "react";
import RenameResource from "../../../Resources/Modals/RenameResource/RenameResource";
import styles from './FacetActionsWrapper.module.scss';

const FacetActionsWrapper = ({ name, rename, children }: {name: string, rename: (newName: string) => void, children: React.ReactNode }) => {

    const [showEditButton, setShowEditButton] = useState(false);

    const displayEditButton = () => {
        setShowEditButton(true);
    }

    const hiddeEditButton = () => {
        setShowEditButton(false);
    }

    return (
        <div onMouseEnter={displayEditButton} onMouseLeave={hiddeEditButton} className={styles.facetActionsWrapper } >
            { showEditButton &&
            <RenameResource currentName={name} hiddeEditButton={ hiddeEditButton } action={rename} />
            }
            { children }
        </div>
    );
}

export default FacetActionsWrapper;