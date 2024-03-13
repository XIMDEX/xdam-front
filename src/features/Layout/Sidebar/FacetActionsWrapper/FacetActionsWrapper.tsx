import React, { useState } from "react";
import RenameResource from "../../../Resources/Modals/RenameResource/RenameResource";
import styles from './FacetActionsWrapper.module.scss';
import { Icon } from "semantic-ui-react";
import MainService from "../../../../api/service";
import { useDispatch } from "react-redux";
import { reloadCatalogue, setSchemas } from "../../../../appSlice";

const FacetActionsWrapper = ({ name,count, canBeEdit,canDelete,route_delete, rename, children }: {name: string,count:int, canBeEdit: boolean,canDelete: boolean,route_delete:string, rename?: (newName: string) => void, children: React.ReactNode }) => {
    const dispatch = useDispatch()
    const [editButtonVisibility, setEditButtonVisibility] = useState<'visible'| 'hidden'>('hidden');

    const displayEditButton = () => {
        setEditButtonVisibility('visible');
    };

    const hiddeEditButton = () => {
        setEditButtonVisibility('hidden');
    };
    const reloadSchemasAndCatalogue = async () => {
        const schemas = await MainService().getSchemas();
        dispatch(reloadCatalogue())
        dispatch(setSchemas(schemas));
    }

    const handleDelete = async () => {
        if (count >0) {
            alert('For delete this item ("'+name+'"), must be not assigned')
            return;
        }
        if (globalThis.confirm('You will be delete "'+ name +'". Are you sure?')) {
            const opts = MainService().getHttpOptions()
            let message = ''
            try {
                await fetch(route_delete, {method: 'DELETE', headers: opts.headers})
                message = 'Deleted successfully!'
                reloadSchemasAndCatalogue()
            } catch (error) {
                message = 'Deleted failed! Contact with your supplier'
            }
            alert(message)
        }
    
    }

    if (canBeEdit) {
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
                    { editButtonVisibility && canDelete  && (
                    <button
                        style={{
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            color:  'red',
                            marginRight: -10,
                        }}
                        onClick={() => {
                            handleDelete()
                            
                        }}
                        
                    ><Icon name='trash alternate' size="small" /></button>
                )}
                </div>
            </div>
        );
    }
    
    return (
        <div className={styles.facetActionsWrapper } >
            <div className={styles.facetActionsWrapper__content}>
                { children }
            </div>
        </div>
    );
}

export default FacetActionsWrapper;