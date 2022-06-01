import React, { useEffect, useState, useCallback, useReducer, useContext } from 'react'
import { Grid, LinearProgress, Container } from '@material-ui/core';
import { Dropdown, Label } from 'semantic-ui-react'
import { makeStyles } from '@material-ui/core/styles';
import MainService from '../../api/service';
import { useSelector, useDispatch } from 'react-redux';
import { setFacets, setResources, setFixedFacets, selectResourcesLoading, setResourcesLoading, setLoading, setSchemas, selectCatalogueFlag } from '../../appSlice';
import IFacet from '../../interfaces/IFacet';
import { selectQuery, selectFacetsQuery, setQuery, selectCollection } from '../../slices/organizationSlice';
import param from '../../utils/querybuilder';
import { Resource } from './Resource';
import { ORGANIZATION, COLLECTION, WORKPSACES, COURSE } from '../../constants';
import { getOrgData, getCollData } from '../../utils/dataFind';
import Dialogs from './Modals/Dialogs';
import Pagination from '@material-ui/lab/Pagination';
import { Button as Btn, Icon as Icn } from 'semantic-ui-react';
import BatchDialog from './Modals/MassiveUpload/BatchDialog';
import store from '../../app/store';
import { SelectableGroup, createSelectable } from 'react-selectable';
import { ResourceQueryContex, resourceQueryReducers } from '../../reducers/ResourceQueryReducer';
import ToggleView from '../../components/ToggleView';
import ResourceCreationDropdown from '../../components/ResourceCreationDropdown';
import LoadingResources from '../../components/LoadingResources';
import ResourcesPaginationControll from './ResourcesPaginationControll';
import ResourcesPagination from './ResourcesPagination';
import FacetChips from '../../components/FacetChips';
import ResCont from './ResourcesDisplay';


const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 0,
    padding: '0 10px',

  },
  rootWithoutSidebar: {
    width: 'calc(100% - 33px)',
    float: 'right',

    paddingRight: 10,
    position: 'relative'
  },
  selectedFilters: {
    display: 'inline-flex',
    overflowY: 'hidden',
    overflowX: 'auto',
    width: '65%',
    height: '44px',
  },

  pagination: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  actionBtns: {
    display: 'flex',
    justifyContent: 'flex-end',
    maxHeight: 38,
  },
  disableActionsWhileLoading: {


    pointerEvents: 'none',


  },
  controlls: {
    width: '100%',
    display: 'inline-grid',
    'grid-template-columns': 'auto 250px'
  }
}
));

export function Resources({ collection, catalogue }) {
  const classes = useStyles();
  
  const facetsQuery = useSelector(selectFacetsQuery);
  const resourcesLoading = useSelector(selectResourcesLoading);
  const [listMode, setListMode] = useState(false);
  const reload = useSelector(selectCatalogueFlag);
  const pagination = {
    perPage: catalogue.per_page,
    lastPage: catalogue.last_page,
    nextPage: catalogue.next_page,
    prevPage: catalogue.prev_page,
    total: catalogue.total
  };

  const localResources = catalogue.data;
  const currentQuery = useSelector(selectQuery);
  const [openBatch, setOpenBatch] = React.useState(false);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [mainContextAction, setMainContextAction] = useState(null);
  const { query, dispatch } = useContext(ResourceQueryContex);

  const collection_id = useSelector(selectCollection);


  function buildFacetsQuery(f) {
    let q = ''
    Object.keys(f).map(i => {
      f[i].forEach(v => {
        q += 'facets[' + i + '][]=' + v + '&'
      })
    })
    return q;
  }

  // const renderFixedFacets = () => {
  //   let orgFacetValues = {}
  //   let collectionsFacets = {}
  //   let wspFacet = {}

  //   let org = selectedOrg

  //   _user.data.organizations.forEach((og) => {
  //     orgFacetValues[og.name] = {
  //       count: og.org_resource_count,
  //       id: og.id
  //     }
  //   })

  //   if (org.id === organization) {
  //     org.collections.forEach((cid) => {
  //       collectionsFacets[cid.name] = {
  //         count: cid.coll_resource_count,
  //         id: cid.id
  //       }
  //     })

  //     // org.workspaces.forEach((wsp) => {
  //     //   wspFacet[wsp.name] = {
  //     //     count: wsp.wsp_resource_count,
  //     //     id: wsp.id
  //     //   }
  //     // })
  //   }

  //   let OFF: IFacet = {
  //     key: ORGANIZATION,
  //     label: 'Organization',
  //     values: orgFacetValues
  //   }

  //   let CFF: IFacet = {
  //     key: COLLECTION,
  //     label: 'Collection',
  //     values: collectionsFacets
  //   }

  //   // let WFF : IFacet =  {
  //   //   key: WORKPSACES,
  //   //   label: 'Workspaces',
  //   //   values: wspFacet
  //   // }
  //   dispatch(setFixedFacets([OFF, CFF]))
  // }


  const OrderBy = () => {
    const opts = [
      {
        key: 'new',
        text: 'Newer first',
        value: 'new',
      },
      {
        key: 'old',
        text: 'Older first',
        value: 'old',
      }

    ]
    return (
      <Dropdown
        style={{ minWidth: 40, marginRight: 4 }}
        placeholder={opts[0].text}
        selection
        selectOnBlur={false}
        defaultValue={opts[0].text}
        options={opts}
      />
    )
  }

  const removeSearch = () => {
    let newQuery = {
      ...currentQuery
    };
    newQuery.page = 1;
    newQuery.search = '';
    dispatch(setQuery(newQuery));
  }

  const handleSelection = (selectedKeys) => {
    console.log(selectedKeys)
    //setSelectedKeys(selectedKeys)
  }



  const newBatch = () => {
    console.log('new batch');
    setMainContextAction('create');
    setOpenBatch(true);
  }

  const newResource = () => {
    setMainContextAction('create');
    setOpenCreate(true);
  }
  
  return (
    <div>
      <LoadingResources loading={resourcesLoading} />
      <div className={classes.controlls}>
        <div>
          <FacetChips facets={catalogue.facets} />
        </div>
        <div>
          <ResourcesPaginationControll pagination={pagination} />
          <ToggleView setListMode={setListMode} />
          <ResourceCreationDropdown options={
            [
              { key: 'batch', icon: 'database', text: 'New batch', value: 'batch', onClick: newBatch },
            ]
          }/>
        </div>
      </div>
      <div>
          <ResCont 
            resources={catalogue.data}
            collection={collection}
            listMode={listMode}
          />
        <ResourcesPagination pagination={pagination} />
      </div>
    </div>
    //   <Grid container justify='flex-start' >
      
    //   <Grid item sm={12}>
    //     <Grid container className={resourcesLoading ? classes.disableActionsWhileLoading : ''}>

    //       {/* <Grid item sm={6} >
    //         {
    //           localResources && localResources.length > 0 ? (
    //             <>
    //               <Label style={{ marginTop: 10 }}>{pagination.total} Resource{pagination.total > 1 ? 's' : ''} found</Label>
    //               {
    //                 currentQuery.search !== '' ? (
    //                   // <Label style={{marginTop: 6}}>Searching for "{currentQuery.search}"</Label>
    //                   <Label style={{ marginTop: 10 }} >
    //                     Searching for "{currentQuery.search}"
    //                       <Icn onClick={removeSearch} name='delete' />
    //                   </Label>
    //                 ) : null
    //               }
    //             </>
    //           ) : ''
    //         }

    //       </Grid> */}
    //       {
    //         localResources && localResources.length > 0 ? (
    //           <Grid container style={{ marginTop: 3 }}>
    //             <Grid item sm={12} >  </Grid>
    //           </Grid>) : null
    //       }

    //       {
    //         localResources && localResources.length > 0 ? <ResCont /> : (resourcesLoading ? '' : <ResourcesNotFound />)
    //       }

    //       <Grid container>
    //         {
    //           localResources && localResources.length > 0 ? (
    //             <Pagination
    //               disabled={resourcesLoading}
    //               variant="outlined" shape="rounded"
    //               count={pagination.last_page}
    //               page={query.page}
    //               style={{ margin: '15px auto' }} onChange={(event, val) => changePage(val)} />
    //           ) : ''
    //         }

    //       </Grid>
    //     </Grid>
    //   </Grid>
    //   <Dialogs
    //     dialogOpen={openCreate}
    //     setDialogOpen={setOpenCreate}
    //     resourceType={selectedColl.resource_type}
    //     action={mainContextAction}
    //   />
    //   <BatchDialog
    //     open={openBatch}
    //     action={mainContextAction}
    //     setOpenBatch={setOpenBatch}
    //   />
    // </Grid>
  );
}