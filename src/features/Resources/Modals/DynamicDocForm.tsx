import React, { useEffect, memo, useState } from 'react';
import {
  Button,
  DialogContent,
  DialogContentText,
  ButtonGroup,
  Grid,
  Card
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import MainService from '../../../api/service';
import { MULTIMEDIA, VALIDS_LOM } from '../../../constants';
import { useSelector, useDispatch } from 'react-redux';
import { selectCollection } from '../../../slices/organizationSlice';
import SemanticForm from "@rjsf/semantic-ui";
import { JSONSchema7 } from 'json-schema';
import { render } from '../../../utils/render';
import { Tab, Label, Icon, Dropdown, Radio } from 'semantic-ui-react'
import { Button as Btn } from 'semantic-ui-react';
import { Message } from 'semantic-ui-react';
import RelatedFiles from './RelatedFiles';
import { setFormData, selectFormData, reloadCatalogue, setLomesSchema, setLomSchema } from '../../../appSlice';
import store from '../../../app/store';
import ArrayFieldTemplate from './DynamicFormTemplates/ArrayFieldTemplate';
import ResourceActionButtons from './ResourceActionButtons';
import { iconHandler } from '../../../utils/iconHandler';
import { InputText, InputTextArea, CustomToggle, CustomInputText, CustomDropdown } from './DynamicFormTemplates/CustomFields';
import LomForm from '../LOM/LomForm';
import TagsFieldTemplate from '../FieldEntities/components/Field/TagsFieldTemplate';
import AiData from '../Tabs/AiData';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      width: '100%'
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    btnPreview: {
      height: 300,
    },
    blur: {
      filter: "blur(2px)",
    },
    addPreview: {
      display: 'none',
      position: 'absolute',
      zIndex: 1,
      left: '7%',
      top: 190,
      userSelect: 'none',
      pointerEvents: 'none'
    },
    dblock: {
      display: 'block'
    },
    formTag: {
      minHeight: 300
    },
    btnGroup: {
      width: '80%',
    },
    divider: {
      padding: '10px 0'
    },
    dismiss: {
      opacity: 1,
      transition: 'opacity 2s ease-'
    },
    imgView: {
      width: '100%'
    }
    
  }),
);

interface IBody {
  [key: string]: any;
  type: string,
  data: string,
  collection_id: string
}

export default function DynamicDocForm({ resourceType, action, schema, dataForUpdate = null, handleClose, showLom = true, canImportData = true }) {
  const classes = useStyles();
  let collection_id = useSelector(selectCollection);
  //let storeFormData = useSelector(selectFormData);
  const dispatch = useDispatch();
  const [previewImage, setPreviewImage] = useState(null);
  const [formFiles, setFormFiles] = useState([]);
  const [processing, setProcessing] = useState(null);
  const messageDefaultState = { display: false, text: '', ok: false }
  const [msg, setMessage] = useState(messageDefaultState);
  const _refForm = React.useRef(null);
  const [mediaType, setMediaType] = useState(dataForUpdate?.type ?? null);
  const [resourceData, setResourceData] = useState(null);
  const [theFiles, setTheFiles] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [tr, triggerReload] = useState(false);
  const [fillAlert, setFillAlert] = useState(false);
  
  
  useEffect(() => {
    
    if(action === 'create') {
      if(getStoreFormData() !== {}) {
        dispatch(setFormData({}));
        triggerReload(!tr)
      }
    } else if (action === 'edit') {
      
      if (showLom) {
        const fetchLomesSchema = async () => { 
          let lomesSchema = await MainService().getLomesSchema();
          dispatch(setLomesSchema(lomesSchema));
        }

        const fecthLomSchema = async () => {
          const lomSchema = await MainService().getLomSchema();
          dispatch(setLomSchema(lomSchema));
        }

        let lomesl = localStorage.getItem('lomes_loaded');
        if(lomesl === null || lomesl === '0') {
          fetchLomesSchema()
          localStorage.setItem('lomes_loaded', '1');
        }

        let loml = localStorage.getItem('lom_loaded');
        if(loml === null || loml === '0') {
          fecthLomSchema()
          localStorage.setItem('lom_loaded', '1');
        }
      }
      
      const getResourceData = async () => {
        //get the resource from db. Data for update is faceted data
        let res = await MainService().getResource(dataForUpdate.id);
        setResourceData(res);
        setTheFiles(res.files);
      }
      if(!loaded) {
        getResourceData();
        dispatch(setFormData(dataForUpdate.data));
        setFillAlert(false);
        setLoaded(true);
      }
    } else if (action === 'view') { 

    } else {

    }
    return function cleanup() {
      //dispatch(setFormData({}));
    };
  
  }, [theFiles, resourceData, loaded ])
  
  const styleBtnPreview = {
    backgroundImage: 'url(' + (previewImage ? URL.createObjectURL(previewImage) : (dataForUpdate ? render(dataForUpdate) : 'noimg.png')) + ')',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  }

  const handleFiles = (e) => {
    if (typeof e.target.type === 'string' && e.target.type === 'file' && e.target.name === 'Preview') {
      setPreviewImage(e.target.files[0]);
      if(formFiles.length === 0 && dataForUpdate?.files.length === 0) {
        setMediaType(e.target.files[0].type.split('/')[0])
      }
    }
    if (typeof e.target.type === 'string' && e.target.type === 'file' && e.target.name === 'File') {
      // console.log('file attached', e.target.files)
      setFormFiles(e.target.files)
      if(resourceType === MULTIMEDIA) {
        // console.log(e.target.files[0].type.split('/')[0])
        setMediaType(e.target.files[0].type.split('/')[0])
      }
    }
  
  }

  function setType() {
    
    if(resourceType !== MULTIMEDIA) {
      return resourceType;
    }

    if(formFiles.length <= 0) {
      if(resourceData?.files.length <= 0) {
        return 'image';
      } else {
        return resourceData?.files[0].mime_type.split('/')[0] ?? 'image';
      }
    } else {
      return formFiles[0].type.split('/')[0];
    }
  }

  const postData = async (form, event) => {
    localStorage.setItem('reload_catalogue', '1');
    setMessage(messageDefaultState)

    const data = form.formData
    /*
    IMPORTANTE: DEFINE MEDIA TYPE ON MULTIMEDIA COLLECTION.
    En la version acutal, el tipo de multimedia se define con esta logica:
      si el user sube SOLO el preview, o SOLO crea el recurso sin preview, ni files: el recurso sera tratado como 'image'
      si el user sube 1 File (o mas), el recurso sera tratado como el mime_type del 1er file cargado en la lista de Files
    */
    
    let body: IBody = {
      type: setType(),
      data: JSON.stringify(data),
      collection_id: collection_id.toString()
    }

    let theFormData = new FormData();
    Object.keys(body).map((e) => {
      theFormData.append(e, body[e]);
    })

    if (formFiles) {
      for (var i = 0; i < formFiles.length; i++) {
        theFormData.append('File[]', formFiles[i]);
      }
    }

    if (previewImage) {
      theFormData.append('Preview', previewImage);
    }

    let res;
    setProcessing(true)
  
    if (dataForUpdate) {
      res = await MainService().updateResource(dataForUpdate.id, theFormData);
    } else {
      console.log(theFormData);
      res = await MainService().createResource(theFormData);
    }
   
    //FormFiles are the files 'adding'
    if(action !== 'create') {
      setFormFiles([])
    }
    setLoaded(false)
    setProcessing(false)
    const resData = await res.json()

    if(!res.ok) {
      setMessage({display: true, ok: res.ok, text: resData.error ?? 'Error 0' })
    } else {  
      setForm(resData.data);
      setMessage({display: true, text: '', ok: res.ok })
    }
    event.preventDefault();
    return false; // prevent reload 
  }

  const getStoreFormData = () => {
    const fd = store.getState().app.formData;
    return fd;
  }

  const metaData = { menuItem: 'Main Data', render: () => <Tab.Pane > <MainData /></Tab.Pane> };
  const lomsData = !showLom ? [] : VALIDS_LOM.map(typeLom => ({menuItem: typeLom.name, render: () => (<Tab.Pane><LomForm data={dataForUpdate} standard={typeLom.key}/></Tab.Pane>)}))
  const AICaptions = { menuItem: 'AI DATA', render: () => <Tab.Pane > <AiData id={dataForUpdate.id} /></Tab.Pane> };
  const pane = [metaData];
  //const panes = [metaData, ...lomsData,AICaptions];
  const [panes, setPanes] = useState([metaData, ...lomsData])
  useEffect(() => {
    const entities = store.getState().app.formData.description.entities_linked;
    const uuids = [];
    const uuidsTabs = [];
    entities.forEach(element => {
      if (uuids.indexOf(element.uuid) === -1) {
        uuids.push(element.uuid);
      }
    });
   uuids.forEach(element => {
    uuidsTabs.push({ menuItem: element, render: () => <Tab.Pane > <AiData id={dataForUpdate.id} /></Tab.Pane> });
   });

  //  console.log(store.getState().app.formData.description.entities_linked);
  console.log(uuids);
    setPanes([...panes,AICaptions,...uuidsTabs])
  }, [])
  
  const setForm = (data) => {
    //dispatch(setFormData(data))
  }
  
  const customWidgets = {
    TextWidget: InputText,
  };
  const uiSchema={
    
    "description": {
      "ui:order": ["active", 'enhanced', "*"],
      "active": {
        "ui:widget": CustomToggle,
      },
      "enhanced": {
        "ui:widget": CustomToggle,
      },
      "course_source": {
        "ui:widget": CustomDropdown,
        "ui:options":{
          label: 'Course source'
        }
      },
      "id": {
          "ui:options": {
            "ui:disable": true
          },
          "ui:disabled": true
      },
      "partials": {
        "pages": {
          "ui:widget": "hidden",
        }
      },
      "description": {
        "ui:widget": InputTextArea,
        "ui:options": {
          "rows": 5
        }
      },
      "body": {
        "ui:widget": InputTextArea,
        "ui:options": {
          "rows": 5
        }
      },
      "name": {
        "ui:widget": CustomInputText,        
      },
      "external_url": {
        "ui:widget": CustomInputText,
        "ui:options":{
          "title": 'External url'
        }
      },
    }
  }

  const updateResourceFromLastCreated = async () => {
    let lastUpdated = await MainService().getLastResource(collection_id, 'lastCreated');
    setForm(lastUpdated.data);
    setFillAlert(true);
    triggerReload(!tr);
    // let res = await MainService().updateResourceFromLastCreated(resourceData.id);
    // setResourceData(res);
  }

  const updateResourceFromLastUpdated = async () => {
    let lastUpdated = await MainService().getLastResource(collection_id, 'lastUpdated');
    setForm(lastUpdated.data);
    setFillAlert(true);
    triggerReload(!tr);
    // let res = await MainService().updateResourceFromLastUpdated(resourceData.id);
    // setForm(res.data);
    // setResourceData(res);
  }

  const MetaDataForm = () => {
    return (
      <Grid item sm={6}>
        <div className='forms-main-btns'>
            {/* <Btn onClick={dispatchForm} loading={processing}>Update</Btn> */}
            
            <Btn color='teal' icon='facebook' onClick={() =>  _refForm.current.click()} loading={processing}> 
              {dataForUpdate ? (
                <>
                  <Icon name='save' /> Save
                </>
              ) : 
                <>
                  <Icon name='save' /> Submit
                </>
              }
            </Btn>
              
              {canImportData && (
                <Dropdown
                    text='Import data'
                    icon='clone'
                    color='teal'
                    labeled
                    button
                    className='icon teal'
                >
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={updateResourceFromLastCreated}>
                      last resource created
                    </Dropdown.Item>
                    <Dropdown.Item onClick={updateResourceFromLastUpdated}>
                      last resource updated
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
              
        </div>
        <div className='form-messages'>    
          <Message color={msg.ok ? 'teal' : 'red'} className={msg.display ? 'zoom-message' : 'hidden-message'} info onDismiss={() => setMessage(messageDefaultState)}>
              {
                msg.ok ? (
                  <>
                    <Message.Header>Done</Message.Header>
                    <p>Resource {dataForUpdate ? 'updated' : 'created'}</p>
                  </>
                ) : (
                  <>
                    <Message.Header>An error ocurred</Message.Header>
                    <p>{msg.text}</p>
                  </>
                )
              }
              
          </Message>
          <Grid item sm={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
              >
                Attach files
                <input
                  type="file"
                  multiple
                  accept={resourceType === MULTIMEDIA ? "audio/*,video/*,image/*" : '*'}
                  onChange={(e)=> handleFiles(e)}
                  name='File'
                  hidden
                />
              </Button>
              {/* {resourceType === MULTIMEDIA ? (
                  <Label> You will upload a {mediaType}</Label>
              ) : null} */}
        </Grid>
        </div>
        <SemanticForm
          id='sfu'
          className={fillAlert ? 'fill-alert' : ''}
          uiSchema={uiSchema}
          schema={schema as JSONSchema7}
          onSubmit={postData}
          formData={getStoreFormData()} 
          onChange={(fd)=> setForm(fd.formData)}
          ArrayFieldTemplate={ArrayFieldTemplate}
          widgets={customWidgets}
        >
          <button ref={_refForm} type="submit" style={{ display: "none" }} />
        </SemanticForm> 
      </Grid>
    )
  };

  const MainData = memo(() => {
    return (
      <Grid container style={{ height: '75vh' }}>
        <FilesAndActions />
        <MetaDataForm />
      </Grid>
    )
  });

  const FilesAndActions = () => {
    return (
      <Grid item sm={6}>
          {dataForUpdate?.data?.description?.image == '' && (<ButtonGroup orientation='vertical'>
            <Grid item sm={12} style={{ minWidth: 400 }}>
              <span
                className={`${classes.addPreview}`}
              >Uplad preview image</span>
              <Button
                className={`${classes.btnPreview}`}
                component="label"
                style={styleBtnPreview}
                fullWidth
                variant='outlined'
              >
                <input
                  accept="image/*"
                  type="file"
                  onChange={(e)=> handleFiles(e)}
                  name='Preview'
                  hidden
                />
              </Button>
            </Grid>

            <Grid item sm={12} className={classes.divider}>
              {dataForUpdate ? (
                <ButtonGroup orientation='horizontal' fullWidth id='forms-btn-actions'>    
                    <ResourceActionButtons resource={dataForUpdate} />
                </ButtonGroup>
              ) : null}
            </Grid>

          </ButtonGroup>)}
          <div style={{ margin: '15px 42px 0px 0px' }}>
            {
              (action === 'view' || action === 'edit' )  && dataForUpdate?.data?.description?.image == '' ? (
                <RelatedFiles
                  resData={resourceData}
                  files={theFiles}
                  withPlayer
                  onEditModal
                  setTheFiles={setTheFiles}
                  DynamicFormResourceData={setResourceData}
                />
              ) : <img src={dataForUpdate?.data?.description?.image} className={classes.imgView} />
            }
            
            {
              formFiles && formFiles.length > 0 ? (
                <>
                  <Label>Adding:</Label>
                  {
                    Array.from(formFiles).map((f, i) => (
                      <Card variant='outlined' className='associated-files-card' key={i}>
                        <Icon name={iconHandler(f)}></Icon>
                        <p><strong>File name:</strong> {f.name}</p>
                        <p><strong>Mime type:</strong> {f.type}</p>
                        <p><strong>Size:</strong> {(f.size / 1000000).toFixed(2)} MB</p>
                      </Card>
                    ))
                  }
                </>
              ) : null
            }

          </div>
        </Grid>
    )
  }

  return (
    <DialogContent className='edit-create-dialog-content'>
      <DialogContentText>
        {/* Describe here how to {action} a {resourceType} */}
        <Btn color='teal' circular icon='close' onClick={() => handleClose()} className='read-card-close-button'/>
      </DialogContentText>
      <Grid container spacing={2}>
        
        <Grid item sm={12} id='form-content'>
          
          {
            dataForUpdate && action === 'edit' ? (<Tab panes={panes} />) : (<Tab panes={pane} />)
          }
          
        </Grid>
        

      </Grid>
    </DialogContent>
  );
}
