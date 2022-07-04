import React, { useState } from "react";
import { Button, Icon, Input } from "semantic-ui-react";
import MainService from "../../../../api/service";
import { CategoryTypes } from "../../../../types/Categories/CategoryTypes";
import styles from "./CreateCategory.module.scss";

const CreateCategory = ({ type, onPersist, creatingCategory }: { type: CategoryTypes, onPersist: (promise: Promise<any>) => Promise<void>, creatingCategory: (value: boolean) => void }) => {

    const [category, setCategory] = useState<{name: string, type: CategoryTypes}>({
        name: null,
        type: type
    });
    const [updating, setUpdating] = useState(false);

    const updateName = (event: React.ChangeEvent<HTMLInputElement>): void => {
        event.preventDefault();

        const nextCategory = {
            ...category,
            name: event.target.value
        }

        creatingCategory(category.name !== null ? category.name.length > 0 : false);

        setCategory(nextCategory);
    }

    const persist = (event: React.SyntheticEvent): void => {
        event.preventDefault();
        
        setUpdating(true);
        onPersist(MainService().createCategory(category))
            .finally(() => {
                setUpdating(false);
                creatingCategory(false);
                setCategory({name: '', type});
            });
    }

    const invalidName = (): boolean => {

        if (!category || !category.name) {
            return true;
        }

        if(category.name.length === 0) {
            return true;
        }


        return false;
    }
    
    return (
        <div className={styles.createCategory__category}>
            <Input
                placeholder="Add a new category"
                value={category.name}
                onChange={updateName}
                className={styles.createCategory__name}
                disabled={updating}
            />
            <Button onClick={persist} disabled={invalidName()} loading={updating} color="teal" size="large" icon>
                <Icon name="save" />
            </Button>
        </div>
    )
}

export default CreateCategory;