import React, { useEffect, useState } from "react";
import Category from "../../../../../types/Categories/Category";
import { Button, Dimmer, Dropdown, Label, Loader, Segment } from "semantic-ui-react";
import styles from "./CategoryDropdown.module.scss";
import { CategoryType } from "../../../../../types/Categories/CategoryTypes";

const CategoryDropdown = (props) => {

    const categoryType = props.uiSchema?.['ui:options']?.categoryType as CategoryType;
    const singleCategory = props.uiSchema?.['ui:options']?.singleCategory || false;
    const categories = props.uiSchema?.['ui:options']?.categories(categoryType);
    const [editableItem, setEditableItem] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState(props.formData || []);
    const [showOptions, setShowOptions] = useState(false);


    useEffect(() => {

        const nextEditableItem = singleCategory
            ? props.items
            : props.items.filter(item => !item.children.props.formData);

        setEditableItem(nextEditableItem[0]);
    }, [props.items]);

    const update = (item) => (event: React.SyntheticEvent, data: any) => {
        event.preventDefault();

        if (data.disabled) return;
        if (!item) return;

        item.children.props.onChange(data.value);

        const nextSelectedCategories = singleCategory
            ? [data.value]
            : [...selectedCategories, data.value];

        setSelectedCategories(nextSelectedCategories);

        setShowOptions(false);
    }

    const pop = (item) => (event: React.SyntheticEvent, _data: any) => {
        event.preventDefault();

        if (!item) {
            return;
        }

        if (singleCategory) {
            item.children.props.onChange(null);
            setSelectedCategories([]);
            return;
        }

        item.onDropIndexClick(item.index)();


        const nextSelectedCategories = selectedCategories.filter(category => category !== item.children.props.formData);
        setSelectedCategories(nextSelectedCategories);
    }

    const displayItems = (event: React.SyntheticEvent, _data: any) => {
        event?.preventDefault();

        setShowOptions(true);

        if (!singleCategory) {
            props.onAddClick();
        }
    }

    const removeEmptyItems = (event: React.SyntheticEvent, _data: any) => {
        event?.preventDefault();

        const emptyItems = props.items.filter(item => !item.children.props.formData);

        emptyItems.forEach(item => {
            item.onDropIndexClick(item.index)();
        });
    }

    const options = categories
        .map((category: Category) => ({
            key: category.id,
            text: category.name.replaceAll('_', ' '),
            value: category.name,
            disabled: selectedCategories.includes(category.name),
            selected: false // https://github.com/Semantic-Org/Semantic-UI-React/issues/3130#issuecomment-455336767
        }));

    const currentValue = singleCategory && selectedCategories.length > 0
        ? selectedCategories[0]
        : null;

    return (
        <Segment.Group className='forms-textField'>
            {!singleCategory &&
                <Segment>
                    <label>{props.title}</label>

                    <div className='forms-arrayContainer'>
                        {props.items.map(item => (
                            (item.children.props.formData && <div key={item.key} className="forms-arrayItem">
                                <div className='forms-textField'>
                                    <Label className='forms-currentItems' size='large'>
                                        {item.children.props.formData.replaceAll('_', ' ')}
                                    </Label>
                                </div>
                                <Button icon='close' size='mini' className="forms-btn-removeArrayItem" onClick={pop(item)} />
                            </div>)
                        ))}

                    </div>
                </Segment>
            }
            <Segment>
                <Dimmer inverted active={categories.length === 0}>
                    <Loader size='mini'>Loading</Loader>
                </Dimmer>
                {singleCategory && <label>{props.title}</label>}
                <div className={styles.category_dropdown__form_element}>
                    <Dropdown
                        placeholder="Add a new category"
                        selection
                        options={options}
                        value={currentValue}
                        closeOnChange={false}
                        open={showOptions}
                        onChange={update(editableItem)}
                        onOpen={displayItems}
                        onClose={removeEmptyItems}
                        disabled={categories.length === 0}
                        className={styles.category_dropdown__categories}
                    />
                    {singleCategory && <Button icon='close' size='mini' className="forms-btn-removeArrayItem" onClick={pop(editableItem)} />}
                </div>
            </Segment>
        </Segment.Group>
    );
}

export default CategoryDropdown;