import React, { useEffect, useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { setQuery, selectCollection, setCollection, setFacetsQuery, selectQuery, selectOrganization } from '../../slices/organizationSlice';
import { Input, Dropdown } from 'semantic-ui-react'

import { setResourcesLoading } from '../../appSlice';
import _ from 'lodash'
import MainService from '../../api/service';

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

export interface Props {
  currentQuery?: any;
  collections?: any;
}

export function Search({ organizationId, switchCollection }) {  
  const [collections, setCollections] = useState([]);
  const [defaultValue, setDefaultValue] = useState(null);
  const dispatch = useDispatch();

  const classes = useStyles();

  const changeCollection = ((_, data) => {
    switchCollection(data.value);
    dispatch(setCollection(data.value));
  });

  // const goSearch = () => {
  //   dispatch(setResourcesLoading(true))
  //   let newQuery = {
  //     ...currentQuery
  //   };
  //   newQuery.page = 1;
  //   let cleanSearch = search.replace(/[`~!@#$%^&*()+\;:'"<>\{\}\[\]\\\/]/gi, '');
  //   newQuery.search = cleanSearch;
  //   dispatch(setQuery(newQuery))
  // }

  useEffect(() => {
    const obtainCollections = async () => {
      const response = await MainService().collections().getOrganizationCollections(organizationId);
      const collections = await response.json();

      setCollections(collections.map(collection => (
        {
          key: collection.id,
          value: collection.id,
          text: collection.name
        }
      )));

      setDefaultValue(collections[0].value);
      dispatch(setQuery({
        page: 1,
        search: ''
      }))
    }

    if(organizationId) {
      obtainCollections();
    }
  }, [organizationId]);

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
        // onKeyDown={}
        // onChange={}
        placeholder='Search...'
        labelPosition='left'
        className={classes.input}
      ></Input>
    </>
  );
}
