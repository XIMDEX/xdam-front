import React, { useState } from "react";
import { Button, Dropdown, Icon, Input } from "semantic-ui-react";
import MainService from "../../../../api/service";
import { CategoryTypes } from "../../../../types/Categories/CategoryTypes";
import styles from "./CreateCategory.module.scss";

const CreateCategory = ({ type, onPersist, creatingCategory }: { type?: CategoryTypes, onPersist: (promise: Promise<any>) => Promise<void>, creatingCategory: (key: string, value: boolean) => void }) => {

    const [category, setCategory] = useState<{name: string, type: CategoryTypes}>({
        name: undefined,
        type: type
    });
    const [updating, setUpdating] = useState(false);

    const updateName = (event: React.ChangeEvent<HTMLInputElement>): void => {
        event.preventDefault();

        const nextCategory = {
            ...category,
            name: event.target.value
        }
        creatingCategory('', category.name !== undefined ? event.target.value.length > 0 : false);

        setCategory(nextCategory);
    }

    const updateType = (event: React.SyntheticEvent, { value }: { value: CategoryTypes}): void => {
        event.preventDefault();

        const nextCategory = {
            ...category,
            type: value
        }

        setCategory(nextCategory);
    }

    const persist = (event: React.SyntheticEvent): void => {
        event.preventDefault();
        
        setUpdating(true);
        onPersist(MainService().createCategory(category))
            .finally(() => {
                setUpdating(false);
                creatingCategory('', false);
                setCategory({name: '', type});
            });
    }

    const cannotBeSaved = (): boolean => {

        if (!category || !category.name || !category.type) {
            return true;
        }

        if(category.name.length === 0) {
            return true;
        }

        return false;
    }

    const typeOptions = Object.values(CategoryTypes).map((type: string, index: number) => ({
        key: index,
        text: type,
        value: type,
    }));
    
    return (
        <div className={styles.createCategory__category}>
            <Input
                placeholder="Add a new category"
                value={category.name}
                onChange={updateName}
                className={styles.createCategory__name}
                disabled={updating}
            />
            <Dropdown 
                placeholder='Category type' 
                value={category.type}
                onChange={updateType}
                options={typeOptions}
                disabled={type !== undefined} 
                selection 
            />
            <Button onClick={persist} disabled={cannotBeSaved()} loading={updating} color="teal" size="large" icon>
                <Icon name="save" />
            </Button>
        </div>
    )
}

export default CreateCategory;