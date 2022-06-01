import React, { useContext } from "react";
import { Dropdown } from "semantic-ui-react";
import { QueryActions, ResourceQueryContex } from "../../reducers/ResourceQueryReducer";


const paginationOptions = [
    {
        key: '12',
        text: '12',
        value: 12,
    },
    {
        key: '24',
        text: '24',
        value: 24,
    },
    {
        key: '36',
        text: '36',
        value: 36,
    },
    {
        key: '48',
        text: '48',
        value: 48,
    }
];


const ResourcesPaginationControll = ({pagination}) => {
    const { query, dispatch } = useContext(ResourceQueryContex);


    const changePageLimit = (_, { value }) => {
        dispatch({
            type: QueryActions.UpdateLimit,
            payload: value
        });
    }
    
    if (!pagination) return <></>;

    return (
        <Dropdown
            style={{ minWidth: 40, marginRight: 4 }}
            onChange={changePageLimit}
            placeholder={pagination.perPage}
            selection
            selectOnBlur={false}
            defaultValue={pagination.perPage}
            options={paginationOptions}
        />
    )
}

export default ResourcesPaginationControll;