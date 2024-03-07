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
import { bookLanguages, courseLanguages, CURRENT_BOOK_VERSION, DEFAULT_THEME_BOOK, MULTIMEDIA, SHOW_THEMES_BOOK, VALIDS_LOM, UNLIMITED_FILES } from '../../../constants';
import { useSelector, useDispatch } from 'react-redux';
import { selectCollection } from '../../../slices/organizationSlice';
import SemanticForm from "@rjsf/semantic-ui";
import { JSONSchema7 } from 'json-schema';
import { render } from '../../../utils/render';
import { Tab, Label, Icon, Dropdown } from 'semantic-ui-react'
import { Button as Btn } from 'semantic-ui-react';
import { Message } from 'semantic-ui-react';
import RelatedFiles from './RelatedFiles';
import { setFormData,  setLomesSchema, setLomSchema } from '../../../appSlice';
import store from '../../../app/store';
import ArrayFieldTemplate from './DynamicFormTemplates/ArrayFieldTemplate';
import ResourceActionButtons from './ResourceActionButtons';
import { iconHandler } from '../../../utils/iconHandler';
import { InputText, InputTextArea, CustomToggle, CustomInputText, CustomDropdown, CustomBookNumberOfUnitSelector } from './DynamicFormTemplates/CustomFields';
import LomForm from '../LOM/LomForm';
import { ResourceLanguage } from './DynamicFormTemplates/ResourceLanguage';
import { ExtraBookData } from './DynamicFormTemplates/CustomFields/ExtraBookData';
import WorkspaceSelect from '../../../components/forms/WorkspaceSelect/WorkspaceSelect';
import { CDNsAttachedToResource, CDNsAttachedToResourceV2 } from './ResourceCDNsAttached';

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

export default function DynamicForm({ resourceType, action, schema, dataForUpdate = null, handleClose }) {
  const classes = useStyles();
  let collection_id = useSelector(selectCollection);
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
  const formulario = React.useRef(null);

  const [loadingTheme, setLoadingTheme] = useState(true)
  const [themes, setThemes] = useState([])

  //cdn functions
  const [maxFiles, setMaxFiles] = useState(0);
  const filesMessageDefaultState = { display: false, text: '' }
  const [filesMsg, setFilesMessage] = useState(filesMessageDefaultState);
  const [formFilesToRemove, setFormFilesToRemove] = useState([]);
 
  const removeMediaFromUploadingQueue = (array_id, resData, maxNumberOfFiles) => {
    let filesPendingAddition = formFiles;

    filesPendingAddition.splice(array_id, 1);
    setFormFiles(filesPendingAddition);
    disableFurtherFilesAttached(resData, maxNumberOfFiles);
    triggerReload(!tr);
  }
  const getCurrentNumberOfFiles = (resData) => {
    let currentCountOfTotalFiles = 0;
    currentCountOfTotalFiles += resData?.files.length;
    currentCountOfTotalFiles += formFiles.length;
    currentCountOfTotalFiles -= formFilesToRemove.length;
    return currentCountOfTotalFiles;
  }


  const removeMediaV2 = (dam, media_id, maxNumberOfFiles) => {
    let filesPendingRemove = formFilesToRemove;
    filesPendingRemove.push(media_id);
    setFormFilesToRemove(filesPendingRemove);

    for (var i = 0; i < resourceData.files.length; i++) {
      if (media_id == resourceData.files[i].id) {
        resourceData.files[i].pendingRemoval = true;
      }
    }

    disableFurtherFilesAttached(dam, maxNumberOfFiles);
    triggerReload(!tr);
  }

  const disableFurtherFilesAttached = (resData, maxNumberOfFiles) => {
    if (maxNumberOfFiles !== null && maxNumberOfFiles !== undefined && maxNumberOfFiles !== UNLIMITED_FILES) {
      let currentNumberOfFiles = getCurrentNumberOfFiles(resData);
     
   
      if (currentNumberOfFiles >= maxNumberOfFiles) {
        
        setFilesMessage({ display: true, text: 'This resource only allows a maximum of ' + maxNumberOfFiles + ' files.' });
      } else {
        setFilesMessage({ display: false, text: '' });
      }
    }
  }

  const handleReplacedFiles = (e, dam, media_id, maxNumberOfFiles) => {
    let filesPendingRemove = formFilesToRemove;
    filesPendingRemove.push(media_id);
    setFormFilesToRemove(filesPendingRemove);
   
    for (var i = 0; i < resourceData.files.length; i++) {
      if (media_id == resourceData.files[i].id) {
        resourceData.files[i].pendingRemoval = true;
      }
    }

    if (typeof e.target.type === 'string' && e.target.type === 'file' && e.target.name === 'File') {
      let filesPendingAddition = formFiles;
      let tempFiles = e.target.files;
      
      for (var i = 0; i < tempFiles.length; i++) {
        filesPendingAddition.push(tempFiles[i]);
      }

      setFormFiles(filesPendingAddition);

      if (resourceType === MULTIMEDIA) {
        setMediaType(tempFiles[0].type.split('/')[0]);
      }
    }

    disableFurtherFilesAttached(dam, maxNumberOfFiles);
    triggerReload(!tr);
  }
  
  //end cdn functions

  useEffect(() => {
    const getThemes = async () => {
        const themes_scorm = await MainService().getBookThemes()
        const newThemes = themes_scorm.map(th => ({key: th, value: th, text: th === 'v1' ? `${th} (deprecated)` : th}))
        setThemes(newThemes)
    }
    if (SHOW_THEMES_BOOK && action === 'edit' && resourceType === 'book') {
        getThemes()
    }
  }, [])

  useEffect(() => {
    if(action === 'create') {
      if(typeof getStoreFormData() !== 'object') {
        dispatch(setFormData({}));
        triggerReload(!tr)
      }
    }

    if (action === 'edit') {

      const fetchLomesSchema = async () => {
        let lomesSchema = await MainService().getLomesSchema();
        dispatch(setLomesSchema(lomesSchema));
      }

      const fecthLomSchema = async () => {
        const lomSchema = await MainService().getLomSchema();
        dispatch(setLomSchema(lomSchema));
      }

      let lomesl = localStorage.getItem('lomes_loaded');
      if(
        (lomesl === null || lomesl === '0')
        && VALIDS_LOM.map(type => type.key).includes('lomes')
      ) {
        fetchLomesSchema()
        localStorage.setItem('lomes_loaded', '1');
      }

      let loml = localStorage.getItem('lom_loaded');
      if (
        (loml === null || loml === '0')
        && VALIDS_LOM.map(type => type.key).includes('lom')
      ) {
        fecthLomSchema()
        localStorage.setItem('lom_loaded', '1');
      }

      const getResourceData = async () => {
        //* get the resource from db. Data for update is faceted data
        let res = await MainService().getResource(dataForUpdate.id);
        if (resourceType === 'book' && !res.version) {
          const version = await MainService().getBookVersion(dataForUpdate.id)
          res.version = version
        }
        if (SHOW_THEMES_BOOK && resourceType === 'book' && !res.theme) {
            setLoadingTheme(true)
            const _theme = await MainService().getBookTheme(dataForUpdate.id)
            res.theme = _theme
        }
        setResourceData(res);
        setLoadingTheme(false)
        setTheFiles(res.files);
      }
      if(!loaded) {
        getResourceData();
        dispatch(setFormData(dataForUpdate.data));
        setFillAlert(false);
        setLoaded(true);
      }
    }
    
    if (action === 'view') {
      // TODO
    }

    return function cleanup() {};
  }, [theFiles, resourceData, loaded ])

  useEffect(() => {
    async function addVersionBook() {
      const version = await MainService().getBookVersion(resourceData.id);
      setResourceData({...resourceData, version})
    }
    async function addThemeBook() {
        const theme = await MainService().getBookTheme(resourceData.id);
        setResourceData({...resourceData, theme})
        setLoadingTheme(false)
    }
    if (resourceType === 'book' && resourceData !== null && !resourceData.hasOwnProperty('version')) {
        addVersionBook()
    }
    if (SHOW_THEMES_BOOK && resourceType === 'book' && resourceData !== null && !resourceData.hasOwnProperty('theme')) {
        setLoadingTheme(true)
        addThemeBook()
    }
  }, [resourceData, setResourceData, resourceType])

  const styleBtnPreview = {
    backgroundImage: 'url(' + (previewImage ? URL.createObjectURL(previewImage) : (dataForUpdate ? render(dataForUpdate) : 'noimg.png')) + ')',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  }

  const showUpgradeButton = resourceType === 'book' && action === 'edit' && resourceData && +resourceData.version !== 0 && +resourceData.version !== CURRENT_BOOK_VERSION

  const handleFiles = (e,resData, maxNumberOfFiles) => {
    let currentNumberOfFiles = getCurrentNumberOfFiles(resData);
    if(maxNumberOfFiles > currentNumberOfFiles || maxNumberOfFiles==="unlimited"){
      if (typeof e.target.type === 'string' && e.target.type === 'file' && e.target.name === 'Preview') {
        setPreviewImage(e.target.files[0]);
        if(formFiles.length === 0 && dataForUpdate?.files.length === 0) {
          setMediaType(e.target.files[0].type.split('/')[0])
        }
      }
      if (typeof e.target.type === 'string' && e.target.type === 'file' && e.target.name === 'File') {
        setFormFiles(e.target.files)
        if(resourceType === MULTIMEDIA) {
          setMediaType(e.target.files[0].type.split('/')[0])
        }
      }
      if (typeof e.target.type === 'string' && e.target.type === 'file' && e.target.name === 'File') {
        let filesPendingAddition = formFiles;
        let tempFiles = e.target.files;
        
        for (var i = 0; i < tempFiles.length; i++) {
          filesPendingAddition.push(tempFiles[i]);
        }
  
        setFormFiles(filesPendingAddition);
  
        if (resourceType === MULTIMEDIA) {
          setMediaType(e.target.files[0].type.split('/')[0])
        }
      }
    }
   
    disableFurtherFilesAttached(resData, maxNumberOfFiles);
    triggerReload(!tr);

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
    event.preventDefault();
    localStorage.setItem('reload_catalogue', '1');
    setMessage(messageDefaultState)
    //filesPendingAddition.splice(array_id, 1);
    //setFormFiles(filesPendingAddition);
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

    if (formFilesToRemove) {
      for (var i = 0; i < formFilesToRemove.length; i++) {
        theFormData.append('FilesToRemove[]', formFilesToRemove[i]);
      }
    }

    let res;
    setProcessing(true)
    
    if (dataForUpdate) {
      res = await MainService().updateResource(dataForUpdate.id, theFormData);
    } else {
      res = await MainService().createResource(theFormData);
    }
    //* FormFiles are the files 'adding'
    if(action !== 'create') {
      setFormFiles([])
    }
    const resData = await res.json()


    let output_message = 'Resource and metadata saved'
    let ouput_ok = res.ok

    if(!res.ok) {
      output_message = 'Error 0';
    }

    if (!showUpgradeButton && resourceType === 'book' && action !== 'create') {
      const {res: resMetadata, resData: dataMetadata} = await saveMetaDataResource()
      if (!resMetadata.ok) {
        ouput_ok = resMetadata.ok;
        output_message = "Resource saved, but save metada is failed - " + dataMetadata.error
      }
    }

    setLoaded(false)
    setProcessing(false)

    setForm(resData.data);
    setMessage({display: true, text: output_message, ok: ouput_ok })
  }

  const getStoreFormData = () => {
    const fd = store.getState().app.formData;
    return fd;
  }

  const metaData = { menuItem: 'Main Data', render: () => <Tab.Pane > <MainData /></Tab.Pane> };
  const lomsData = VALIDS_LOM.map(typeLom => ({menuItem: typeLom.name, render: () => (<Tab.Pane><LomForm data={dataForUpdate} standard={typeLom.key}/></Tab.Pane>)}))

  const pane = [metaData];
  const panes = [metaData, ...lomsData];

  const setForm = (data) => {
    dispatch(setFormData(data))
  }

  const customWidgets = {
    TextWidget: InputText,
  };

  const fields = { bookExtraData: ExtraBookData };

  const uiSchema={
    "description": {
      "ui:order": ["active", "isFree", "*"],
      "active": {
        "ui:widget": CustomToggle,
      },
      "isFree": {
        "ui:widget": CustomToggle,
      },
      "course_source": {
        "ui:widget": CustomDropdown,
        "ui:options":{
          label: 'Course source'
        }
      },
      "unit": {
        "ui:widget": CustomBookNumberOfUnitSelector,
        "ui:options": {
          "max": 50
        }
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
      "name": {
        "ui:widget": CustomInputText,
      },
      "external_url": {
        "ui:widget": CustomInputText,
        "ui:options":{
          "title": 'External url'
        }
      },
      "lang": {
        "ui:widget": ResourceLanguage,
        "ui:options": {
          opt: ["es", "cat", "en", "eu", "gl"],
          label: 'Language',
          enum: bookLanguages
        }
      },
      "language": {
        "ui:widget": ResourceLanguage,
        "ui:options": {
          opt: Object.keys(courseLanguages),
          label: 'Language',
          enum: courseLanguages
        }
      },
      "extra": {
        "ui:field": "bookExtraData",
      }
    }
  }


  const updateResourceFromLastCreated = async () => {
    let lastUpdated = await MainService().getLastResource(collection_id, 'lastCreated');
    setForm(lastUpdated.data);
    setFillAlert(true);
    triggerReload(!tr);
  }

  const updateResourceFromLastUpdated = async () => {
    let lastUpdated = await MainService().getLastResource(collection_id, 'lastUpdated');
    setForm(lastUpdated.data);
    setFillAlert(true);
    triggerReload(!tr);
  }

  const handleUpdateMetadataResource = async () => {
    setMessage(messageDefaultState)

    const {res, resData} = await saveMetaDataResource()

    if(!res.ok) {
      setMessage({display: true, ok: res.ok, text: resData.error ?? 'Error 0' })
    } else {
      setMessage({display: true, text: 'Book updated at V2', ok: res.ok })
    }

  }

  const saveMetaDataResource = async () => {
    const data = formulario?.current?.state?.formData?.description ?? resourceData?.data?.description
    data.id = resourceData.id
    data.theme = resourceData.theme

    if (resourceData.version === 1) data.upgrading = true

    var form_data = new FormData();
    for ( var key in data ) {
        form_data.append(key, data[key]);
    }

    const res = await MainService().updateMetadataBook(data)
    const resData = res.ok ? await res.json() : {error: await res.text()}

    return {res, resData}
  }

  const handleResourceTheme = (_, {value}) => {
    setResourceData({...resourceData, theme: value})
  }

  const MetaDataForm = () => {
    return (
      <Grid item sm={6}>
        <div className='forms-main-btns'>
            <Btn color='teal' icon='facebook' onClick={() =>  _refForm.current.click()} loading={processing}>
              {dataForUpdate ? (
                <><Icon name='save' /> Save</>
              ) : (
                <><Icon name='save' /> Submit</>
              )}
            </Btn>
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
            { showUpgradeButton && (
              <Btn color='teal' onClick={handleUpdateMetadataResource} >
                <Icon name='angle double up' /> Upgrade v2
              </Btn>
            )}
        </div>
        <div className='form-messages'>
          <Message color={msg.ok ? 'teal' : 'red'} className={msg.display ? 'zoom-message' : 'hidden-message'} info onDismiss={() => setMessage(messageDefaultState)}>
              {
                msg.ok ? (
                  <>
                    <Message.Header>Done</Message.Header>
                    <p>{msg.text !== '' ? msg.text : `Resource ${dataForUpdate ? 'updated' : 'created'}`}</p>
                  </>
                ) : (
                  <>
                    <Message.Header>An error ocurred</Message.Header>
                    <p>{msg.text}</p>
                  </>
                )
              }

          </Message>
        </div>
        {SHOW_THEMES_BOOK && resourceType === 'book' && action !== 'create' && (
            <div className='form-theme'>
                <label style={{fontWeight: 'bold'}}>Select Theme</label>
                <Dropdown
                    placeholder='Select theme'
                    fluid
                    selection
                    onChange={handleResourceTheme}
                    loading={loadingTheme}
                    value={resourceData?.theme}
                    options={themes}
                />
            </div>
        )}
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
          fields={fields}
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
    const replaceMedia = async (input_id) => {
      document.getElementById(input_id).click();
    }
    const appData = getStoreFormData();
    setMaxFiles(appData?.max_files);
    return (
      <Grid item sm={6}>
          <ButtonGroup orientation='vertical'>
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
                  onChange={(e)=> handleFiles(e,resourceData, maxFiles)}
                  name='Preview'
                  hidden
                />
              </Button>
            </Grid>

            <Grid item sm={12} className={classes.divider}>
              {dataForUpdate ? (
                <ResourceActionButtons resource={dataForUpdate} themeBook={resourceData?.theme ?? DEFAULT_THEME_BOOK} />
              ) : null}
            </Grid>

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
                  onChange={(e)=> handleFiles(e,resourceData, maxFiles)}
                  name='File'
                  hidden
                />
              </Button>
              <Message color={'orange'} className={filesMsg.display ? 'zoom-message' : 'hidden-message'} info>
                <Message.Header>Warning!</Message.Header>
                <p>{filesMsg.text}</p>                    
              </Message>
              {/* {resourceType === MULTIMEDIA ? (
                  <Label> You will upload a {mediaType}</Label>
              ) : null} */}
            </Grid>
            <Grid item sm={12} className={classes.divider}>
                <WorkspaceSelect resourceData={resourceData} dataForUpdate={dataForUpdate}/>
                {/* <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Wokspace</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={workspaceSelect}
                        label="Workspace"
                        onChange={handleWorkspaceSelect}
                    >
                    {workspacesOptions.map(option => <MenuItem value={option.value}>{option.label}</MenuItem>)}
                 </Select>
                </FormControl> */}
            </Grid>
          </ButtonGroup>
          <div style={{ margin: '15px 42px 0px 0px' }}>
            {
              action === 'view' || action === 'edit' ? (
                <RelatedFiles
                  resData={resourceData}
                  files={theFiles}
                  withPlayer
                  onEditModal
                  setTheFiles={setTheFiles}
                  DynamicFormResourceData={setResourceData}
                  maxNumberOfFiles={maxFiles}
                  replaceMedia={replaceMedia}
                  handleReplacedFiles={handleReplacedFiles}
                  removeMediaV2={removeMediaV2}
                  fileType={resourceType}
                />
              ) : null
            }

            {
              formFiles && formFiles.length > 0 ? (
                <>
                  <Label>Adding:</Label>
                  {
                    Array.from(formFiles).map((f, i) => (
                      <Card variant='outlined' className='associated-files-card associated-files-card-pending-addition' key={i}>
                      <Icon name={iconHandler(f)}></Icon>
                      <p><strong>File name:</strong> {f.name}</p>
                      <p><strong>Mime type:</strong> {f.type}</p>
                      <p><strong>Size:</strong> {(f.size / 1000000).toFixed(2)} MB</p>
                      <a className={'remove-media-from-uploading-queue-button'} onClick={() => removeMediaFromUploadingQueue(i, resourceData, maxFiles)} >Remove</a>
                    </Card>
                    ))
                  }
                </>
              ) : null
            }
            <CDNsAttachedToResourceV2
              resourceData={resourceData}
              formData={appData}
            />
          </div>
        </Grid>
    )
  }

  return (
    <DialogContent className='edit-create-dialog-content' style={{paddingBottom: 233}}>
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
