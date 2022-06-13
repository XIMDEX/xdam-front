import React, { useState } from "react";
import WorkspaceRenameModal from "../../../../Resources/Modals/WorkspaceRenameModal/WorkspaceRenameModal";
import styles from './WorkspaceFacetCardWrapper.module.scss';

const WorkspaceFacetCardWrapper = ({ workspaceName, children }: { workspaceName: string, children: React.ReactNode}) => {
    
    const [showEditButton, setShowEditButton] = useState(false);

    const displayEditButton = () => {
        setShowEditButton(true);
    }

    const hiddeEditButton = () => {
        setShowEditButton(false);
    }

    return (
        <div onMouseEnter={displayEditButton} onMouseLeave={hiddeEditButton} className={styles.workspaceFacetCardWrapper}>
            {showEditButton &&
                <WorkspaceRenameModal currentName ={workspaceName} hiddeEditButton={hiddeEditButton} />
            }
            {children}
        </div>
    );
}

export default WorkspaceFacetCardWrapper;