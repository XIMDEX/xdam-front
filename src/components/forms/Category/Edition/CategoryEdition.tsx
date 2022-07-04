import React, { useState } from "react";
import { Button, Dropdown, Icon, Input } from "semantic-ui-react";
import MainService from "../../../../api/service";
import Category from "../../../../types/Categories/Category";
import { CategoryTypes } from "../../../../types/Categories/CategoryTypes";
import styles from "./CategoryEdition.module.scss";

const EditCategory = ({ category: initial, onPersist, updatingCategory }: { category: Category, onPersist: (promise: Promise<any>) => Promise<void>, updatingCategory: (value: boolean) => void }) => {

    const [category, setCategory] = useState<Category>(initial);
    const [updating, setUpdating] = useState(false);

    const updateName = (event: React.ChangeEvent<HTMLInputElement>): void => {
        event.preventDefault();

        const nameWithUnderscores = event.target.value.replaceAll(' ', '_');

        const nextCategory = {
            ...category,
            name: nameWithUnderscores
        }

        updatingCategory(initial.name !== nameWithUnderscores);

        setCategory(nextCategory);
    }

    const updateType = (event: React.SyntheticEvent, { value }: { value: CategoryTypes }): void => {
        event.preventDefault();

        const nextCategory = {
            ...category,
            type: value
        }

        setCategory(nextCategory);
    }

    const persistUpdate = (event: React.SyntheticEvent) => {
        event.preventDefault();

        setUpdating(true);
        onPersist(MainService().updateCategory(category))
            .finally(() => {
                setUpdating(false);
                updatingCategory(false);
            });
    }

    const persistRemove = (event: React.SyntheticEvent) => {
        event.preventDefault();

        setUpdating(true);
        onPersist(MainService().deleteCategory(category.id))
            .finally(() => {
                setUpdating(false);
                updatingCategory(false);
            });
    }

    const cannotSave = updating 
        ? true
        : initial.name === category.name;

    const nameWithoutUnderscores = category.name.replaceAll('_', ' ');

    const typeOptions = Object.values(CategoryTypes).map((type: string, index: number) => ({
        key: index,
        text: type,
        value: type,
    }));

    return (
        <div className={styles.categoryEdition__category}>
            <Input
                placeholder={initial.name}
                value={nameWithoutUnderscores}
                onChange={updateName}
                className={styles.categoryEdition__name}
                disabled={updating}
            />
            <Dropdown 
                placeholder='Category type'
                value={category.type}
                onChange={updateType}
                options={typeOptions}
                selection
            />
            <Button onClick={persistUpdate} disabled={cannotSave} loading={updating} color="teal" size="large" icon>
                <Icon name="save" />
            </Button>
            <Button onClick={persistRemove} disabled={updating} color="red" size="large" icon>
                <Icon name="trash" />
            </Button>
        </div>
    )
}

export default EditCategory;