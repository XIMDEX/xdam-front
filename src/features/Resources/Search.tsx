import React, { useContext, useEffect, useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { setQuery } from '../../slices/organizationSlice';
import { Input, Dropdown } from 'semantic-ui-react'

import _ from 'lodash'
import MainService from '../../api/service';
import { QueryActions, ResourceQueryContex } from '../../reducers/ResourceQueryReducer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
    input: {
      width: '100%'
    }
  }),
);

export function Search() {
  const { query, dispatch } = useContext(ResourceQueryContex);
  const [collections, setCollections] = useState([]);
  const [defaultValue, setDefaultValue] = useState(null);
  // const dispatch = useDispatch();

  const classes = useStyles();

  const changeCollection = ((_, data) => {
    const collectionId = data.value;

    MainService().collections().getCollection(collectionId)
    .then(response => response.json())
    .then(collection => {
      dispatch({
        type: QueryActions.UpdataCollection,
        payload: collection
      });
    })


    // dispatch(setCollection(data.value));
  });

  const goSearch = () => {
    // let newQuery = {
    //   ...currentQuery
    // };
    // newQuery.page = 1;
    // let cleanSearch = search.replace(/[`~!@#$%^&*()+\;:'"<>\{\}\[\]\\\/]/gi, '');
    // newQuery.search = cleanSearch;
    // dispatch(setQuery(newQuery))
  }

  const changeSearch = (event) => {
    dispatch({
      type: QueryActions.UpdateSearch,
      payload: event.target.value
    })
  }

  const SeachKeyDown = (event) => {
    if (event.key === 'Enter') {
      goSearch()
    }
  }

  useEffect(() => {
    const obtainCollections = async () => {
      const response = await MainService().collections().getOrganizationCollections(query.organizationId);
      const collections = await response.json();

      setCollections(collections.map(collection => (
        {
          key: collection.id,
          value: collection.id,
          text: collection.name
        }
      )));

      setDefaultValue(collections[0].value);
      // dispatch({
      //   type: QueryActionTypes.UpdataCollection,
      //   payload: collections[0].value
      // })
      // dispatch(setQuery({
      //   page: 1,
      //   search: ''
      // }))
    }

    if (query.organizationId) {
      obtainCollections();
    }
  }, [query.organizationId]);

  return (
    <>
      <Dropdown
        selection
        floating
        button
        defaultValue={defaultValue}
        options={collections}
        onChange={changeCollection}
      />
      <Input
        fluid
        onKeyDown={SeachKeyDown}
        onChange={changeSearch}
        placeholder='Search...'
        labelPosition='left'
        className={classes.input}
      ></Input>
    </>
  );
}
