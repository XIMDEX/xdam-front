import React, { useState } from 'react'
import { Button, Dropdown } from 'semantic-ui-react'
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { selectResourcesLoading } from '../../appSlice';
import ToggleView from '../../components/ToggleView';
import ResourceCreationControll from '../../components/ResourceCreationDropdown';
import LoadingResources from '../../components/LoadingResources';
import ResourcesPaginationControll from './ResourcesPaginationControll';
import ResourcesPagination from './ResourcesPagination';
import FacetChips from '../../components/FacetChips';
import ResCont from './ResourcesDisplay';
import Dialogs from './Modals/Dialogs';
import BatchDialog from './Modals/MassiveUpload/BatchDialog';
import CanIDo from '../../components/CanIDo';
import { ResourceActions } from '../../hooks/useCanIDo';


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
  resourcesHeader: {
    width: '100%',
    display: 'inline-grid',
    'grid-template-columns': 'auto 350px',
    padding: '0 10px'
  },
  controlls: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  chipsWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  }
}
));

export function Resources({ collection, pagination, facets, resources }) {
  const classes = useStyles();
  
  const resourcesLoading = useSelector(selectResourcesLoading);
  const [listMode, setListMode] = useState(true);
  const [openBatch, setOpenBatch] = React.useState(false);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [mainContextAction, setMainContextAction] = useState(null);

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
      <div className={classes.resourcesHeader}>
        <div className={classes.chipsWrapper}>
          <FacetChips/>
        </div>
        <div className={classes.controlls}>
          <div>
            <ResourcesPaginationControll pagination={pagination} />
            <ToggleView setListMode={setListMode} />
            <CanIDo action={ResourceActions.CreateResource}>
              <ResourceCreationControll options={
                [
                  { key: 'batch', icon: 'database', text: 'New batch', value: 'batch', onClick: newBatch },
                ]
              } >
                {collection &&
                  <CanIDo action={ResourceActions.CreateResource}>
                    <Button onClick={newResource} >{'New ' + collection.accept}</Button>
                  </CanIDo>
                }
              </ResourceCreationControll>
            </CanIDo>
          </div>
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
      {collection && <Dialogs
        dialogOpen={openCreate}
        setDialogOpen={setOpenCreate}
        resourceType={collection.accept}
        action={mainContextAction}
      />}
      <BatchDialog
        open={openBatch}
        action={mainContextAction}
        setOpenBatch={setOpenBatch}
      />
    </div>
  );
}