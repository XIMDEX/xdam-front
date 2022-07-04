import React, { useEffect, useState } from "react";
import { Button, Dimmer, Icon, Loader, Modal } from "semantic-ui-react";
import { useDispatch } from "react-redux";
import { reloadCatalogue } from "../../../../appSlice";
import useCategories from "../../../../hooks/useCategories";
import { CategoryTypes } from "../../../../types/Categories/CategoryTypes";
import Category from "../../../../types/Categories/Category";
import EditCategory from "../../../../components/forms/Category/Edition/CategoryEdition";
import CreateCategory from "../../../../components/forms/Category/Creation/CreateCategory";
import styles from './CategoriesManagement.module.scss';

const CategoriesManagement = ({ categoryType}: { categoryType: CategoryTypes }) => {

    const [open, setOpen] = useState(false);
    const [synchronize, setSynchronize] = useState(0);
    const [loading, setLoading] = useState(true);
    const categories = useCategories(synchronize, categoryType);
    const dispatch = useDispatch();

    useEffect(() => {
        setLoading(categories.length === 0);
    }, [categories]);

    const sync = async (promise: Promise<void>): Promise<void> => {
        await promise;

        setSynchronize(Date.now());
    }

    const openModal = (event: React.SyntheticEvent): void => {
        event.preventDefault();
        event.stopPropagation();

        setOpen(true);
    }

    const closeModal = (): void => {
        setOpen(false);

        dispatch(reloadCatalogue());
    }

    const stopEvent = (event: React.SyntheticEvent): React.SyntheticEvent => {
        event.preventDefault();
        event.stopPropagation();

        return event;
    }

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            onClick={stopEvent}
            trigger={
                <div className={styles.categoriesManagement__edit} onClick={openModal}>
                    <Icon name='pencil alternate' size="small" />
                </div>
            }
        >
            <Modal.Header>Edit {categoryType} categories</Modal.Header>
            <Modal.Content scrolling>
                {loading && <Dimmer active inverted>
                    <Loader>Loading</Loader>
                </Dimmer>}
                <div className={styles.categoriesManagement__inputsList}>
                    <CreateCategory type={categoryType} onPersist={sync} />
                    {
                        categories.map((category: Category) => (
                            <EditCategory key={category.id} category={category} onPersist={sync} />
                        ))
                    }
                </div>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={closeModal}>
                    Done
                </Button>
            </Modal.Actions>
        </Modal>
    )
}

export default CategoriesManagement; 