import React, { useState, useContext } from 'react'
import { Dropdown } from 'semantic-ui-react'
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { selectResourcesLoading } from '../../appSlice';
import { selectQuery } from '../../slices/organizationSlice';
import { ResourceQueryContex } from '../../reducers/ResourceQueryReducer';
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

export function Resources({ collection, pagination, facets, resources }) {
  const classes = useStyles();
  
  const resourcesLoading = useSelector(selectResourcesLoading);
  const [listMode, setListMode] = useState(false);


  const currentQuery = useSelector(selectQuery);
  const [openBatch, setOpenBatch] = React.useState(false);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [mainContextAction, setMainContextAction] = useState(null);
  const { query, dispatch } = useContext(ResourceQueryContex);


  function buildFacetsQuery(f) {
    let q = ''
    Object.keys(f).map(i => {
      f[i].forEach(v => {
        q += 'facets[' + i + '][]=' + v + '&'
      })
    })
    return q;
  }

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
          <FacetChips facets={facets} />
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
            resources={resources}
            collection={collection}
            listMode={listMode}
          />
        <ResourcesPagination pagination={pagination} />
      </div>
    </div>
  );
}