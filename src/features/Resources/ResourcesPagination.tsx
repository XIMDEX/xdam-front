import React, { useContext } from "react";
import { QueryActions, ResourceQueryContex } from "../../reducers/ResourceQueryReducer";
import Pagination from '@material-ui/lab/Pagination';

const ResourcesPagination = ({pagination}) => {
    const { query, dispatch } = useContext(ResourceQueryContex);

    const changePage = (_, page: number) => {
        dispatch({
            type: QueryActions.UpdatePage,
            payload: page
        })
    }

    if (!pagination || pagination.last_page === query.page) {
        return <></>;
    }

    return (
        <Pagination
            variant="outlined" shape="rounded"
            count={pagination.lastPage}
            page={query.page}
            style={{ margin: '15px auto' }}
            onChange={changePage} 
        />
    )
}

export default ResourcesPagination;