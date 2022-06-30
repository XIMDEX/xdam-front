import React, { useEffect, useState } from "react";
import Category from "../../../../../types/Categories/Category";
import { Button, Dropdown, Label, Segment } from "semantic-ui-react";

const CategoryDropdown = (props) => {

    const categories = props.uiSchema?.['ui:options']?.categories(props.uiSchema?.['ui:options']?.categoryType);
    const [emptyItem, setEmptyItem] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState(props.formData || []);
    const [showOptions, setShowOptions] = useState(false);

    useEffect(() => {
        const emptyItems = props.items.filter(item => !item.children.props.formData);
        setEmptyItem(emptyItems[0]);
    }, [props.items]);

    const add = (item) => (event: React.SyntheticEvent, data: any) => {
        event.preventDefault();

        if (data.disabled) return;
        if (!item) return;

        item.children.props.onChange(data.value);

        setSelectedCategories([...selectedCategories, data.value]);
        setShowOptions(false);
    }

    const pop = (item) => (event: React.SyntheticEvent, _data: any) => {
        event.preventDefault();

        item.onDropIndexClick(item.index)();

        const nextSelectedCategories = selectedCategories.filter(c => c !== item.children.props.formData);
        setSelectedCategories(nextSelectedCategories);
    }

    const addEmptyItem = (event: React.SyntheticEvent, _data: any) => {
        event.preventDefault();

        setShowOptions(true);
        props.onAddClick();
    }

    const removeEmptyItems = (event: React.SyntheticEvent, _data: any) => {
        event.preventDefault();

        const emptyItems = props.items.filter(item => !item.children.props.formData);
        console.log(event, _data);

        emptyItems.forEach(item => {
            item.onDropIndexClick(item.index)();
        });
    }

    const options = categories
        .map((category: Category) => ({
            key: category.id,
            text: category.name.replaceAll('_', ' '),
            value: category.name,
            disabled: selectedCategories.includes(category.name)
        }));

    return (
        <Segment.Group className='forms-textField'>
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
            {props.canAdd &&
                <Segment>
                    <Dropdown
                        placeholder="Add a new category"
                        selection
                        fluid
                        options={options}
                        value={null}
                        closeOnChange={false}
                        open={showOptions}
                        onChange={add(emptyItem)}
                        onOpen={addEmptyItem}
                        onClose={removeEmptyItems}
                    />
                </Segment>
            }
        </Segment.Group>
    );
}

export default CategoryDropdown;