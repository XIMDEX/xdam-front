import React, { useState } from "react";
import RenameResource from "../../../Resources/Modals/RenameResource/RenameResource";
import styles from './FacetActionsWrapper.module.scss';

const FacetActionsWrapper = ({ name, rename, children }: {name: string, rename?: (newName: string) => void, children: React.ReactNode }) => {

    const [editButtonVisibility, setEditButtonVisibility] = useState<'visible'| 'hidden'>('hidden');

    const displayEditButton = () => {
        setEditButtonVisibility('visible');
    }

    const hiddeEditButton = () => {
        setEditButtonVisibility('hidden');
    }

    return (
        <div onMouseEnter={displayEditButton} onMouseLeave={hiddeEditButton} className={styles.facetActionsWrapper } >
            <div className={styles.facetActionsWrapper__content}>
                { children }
            </div>
            <div 
                className={styles.facetActionsWrapper__buttons}
                style={{ "--visibility": editButtonVisibility} as React.CSSProperties}    
            >
                { editButtonVisibility &&
                <RenameResource currentName={name} hiddeEditButton={ hiddeEditButton } action={rename} />
                }
            </div>
        </div>
    );
}

export default FacetActionsWrapper;