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
import { Tab, Label, Icon, Dropdown, Radio} from 'semantic-ui-react'
import { Button as Btn } from 'semantic-ui-react';
import { Message } from 'semantic-ui-react';
import RelatedFiles from './RelatedFiles';
import { selectResources, selectWorkspacesData, setFormData,  setLomesSchema, setLomSchema, setResources } from '../../../appSlice';
import store from '../../../app/store';
import ArrayFieldTemplate from './DynamicFormTemplates/ArrayFieldTemplate';
import ResourceActionButtons from './ResourceActionButtons';
import { iconHandler } from '../../../utils/iconHandler';
import { InputText, InputTextArea, CustomToggle, CustomInputText, CustomDropdown, CustomBookNumberOfUnitSelector } from './DynamicFormTemplates/CustomFields';
import LomForm from '../LOM/LomForm';
import { ResourceLanguage } from './DynamicFormTemplates/ResourceLanguage';
import { ExtraBookData } from './DynamicFormTemplates/CustomFields/ExtraBookData';
import MediaData from './Tabs/MediaData';
import CDNData from './Tabs/CDN/CDNData';
import WorkspaceSelect from '../../../components/forms/WorkspaceSelect/WorkspaceSelect';
import { CDNsAttachedToResource, CDNsAttachedToResourceV2 } from './ResourceCDNsAttached';
import { currentCollection, max_num_files_collection } from '../../../slices/collectionSlice';

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
  const wps_data = useSelector(selectWorkspacesData);

  const maxFiles = useSelector(max_num_files_collection)
  const dispatch = useDispatch();
  const [previewImage, setPreviewImage] = useState(null);
  const [formFiles, setFormFiles] = useState([]);
  const [processing, setProcessing] = useState(null);
  const [processingDuplicate, setProcessingDuplicate] = useState(null);
  const [canDuplicate,setCanDuplicate] = useState(false);
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
  const [firstAction,setFirstAction] = useState(true);
  const [wksSelected, setWksSelected] = useState(() => {
    let wps = []
    const wps_ids = dataForUpdate?.workspaces ?? []
    Object.keys(wps_data).map((key) => {
        if(wps_ids.some(id => wps_data[key].id == id)) {
            wps.push(wps_data[key])
        }
    })

    return {
      resource_id: dataForUpdate?.id ?? null,
      wsp: wps
    }
  });

  const [accessibility, setAccessibility] = useState(false);

  const resources  = useSelector(selectResources)

  const handleWorkspaceSelected = (data) => {
    setWksSelected(data)

  }

  const setResource = (workspaces) => {
    let resourceIndex = resources.findIndex(obj => obj.id === resourceData.id);
    if (resourceIndex !== -1) {
        let updatedResource = {
            ...resources[resourceIndex],
            workspaces: workspaces.map(workspace => String(workspace))
        };
        let updatedResources = [...resources];
        updatedResources[resourceIndex] = updatedResource;
        dispatch(setResources(updatedResources));
    }
}


  const [loadingTheme, setLoadingTheme] = useState(true)
  const [themes, setThemes] = useState([])

  const [showUpgradeButton, setShowUpgradeButton] = useState(false)
  const showDuplicateButton = (resourceType === "book")

  //cdn functions
//   const [maxFiles, setMaxFiles] = useState(0);
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
    currentCountOfTotalFiles += resData?.files.length ?? 0;
    currentCountOfTotalFiles += formFiles.length ?? 0;
    currentCountOfTotalFiles -= formFilesToRemove.length ?? 0;
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


      if (currentNumberOfFiles >= maxNumberOfFiles && maxNumberOfFiles !== -1) {

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

  const retryDuplicate = async (id) => {
    const res = await MainService().duplicateRetry(id);
    if (res.error) {
      setMessage({display: true, text: res.error + '. Please contact with your administrator', ok: false});
    } else {
      setMessage({display: true, text: "Resource Duplicated successfully", ok: true});
    }
  }

  const getDuplicateStatus = async(resData)  => {
    let isNotPending = true;
    const duplicateStatus =  await MainService().duplicateStatus(resData.id)
    if (duplicateStatus && duplicateStatus?.status === "pending") {
      setMessage({ display: true, text: "Processing Files, Please wait", ok: true });
      isNotPending = false;
    }
    if (duplicateStatus && duplicateStatus?.status === "error") {
        setMessage({
            display: true,
            text: (
                <p>Error: {duplicateStatus?.message}
                <button
                    onClick={() => retryDuplicate(resData.id)}
                    style={{
                        marginLeft: '0.25em',
                        textDecoration: 'underline',
                        backgroundColor: 'transparent',
                        color: '#c82121',
                        fontWeight: 'bold',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >Try again</button></p>
            ), ok: false });
        isNotPending = false;
    }
    setCanDuplicate(isNotPending);
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
        fetchLomesSchema();
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

      const checkIfCanUpgrade = async (id) => {
        const can_upgrade = await MainService().checkIfCanUpgradeScrom(id)
        setShowUpgradeButton(can_upgrade)
      }

      const getResourceData = async () => {
        //* get the resource from db. Data for update is faceted data
        let res = await MainService().getResource(dataForUpdate.id);
        // if (resourceType === 'book' && !res.version) {
        //   const version = await MainService().getBookVersion(dataForUpdate.id)
        //   res.version = version
        // }
        if (SHOW_THEMES_BOOK && resourceType === 'book' && !res.theme) {
            setLoadingTheme(true)
            const _theme = await MainService().getBookTheme(dataForUpdate.id)
            res.theme = _theme
        }
        setResourceData(res);
        setLoadingTheme(false)
        setTheFiles(res.files);


        if (resourceType === 'book' && action === 'edit') {
            getDuplicateStatus(res)
            checkIfCanUpgrade(res.id)
        }
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
    // async function addVersionBook() {
    //   const version = await MainService().getBookVersion(resourceData.id);
    //   setResourceData({...resourceData, version})
    // }
    async function addThemeBook() {
        const theme = await MainService().getBookTheme(resourceData.id);
        setResourceData({...resourceData, theme})
        setLoadingTheme(false)
    }
    // if (resourceType === 'book' && resourceData !== null && !resourceData.hasOwnProperty('version')) {
    //     addVersionBook()
    // }
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

//   const showUpgradeButton = resourceType === 'book' && action === 'edit' && resourceData && +resourceData.version !== 0 && +resourceData.version !== CURRENT_BOOK_VERSION

  const handleFiles = (e,resData, maxNumberOfFiles) => {
    let currentNumberOfFiles = getCurrentNumberOfFiles(resData);
    if(maxNumberOfFiles > currentNumberOfFiles || maxNumberOfFiles=== UNLIMITED_FILES || maxNumberOfFiles === -1){
      if (typeof e.target.type === 'string' && e.target.type === 'file' && e.target.name === 'Preview') {
        setPreviewImage(e.target.files[0]);
        if(formFiles?.length === 0 && dataForUpdate?.files?.length === 0) {
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

    if (wksSelected?.wsp?.length !== 0) {
        const valuesWsp: number[] = wksSelected?.wsp?.map(e => e.id)
        theFormData.append('toWorkspaceId', valuesWsp.join(',') )
    }

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

    if (dataForUpdate) {
        let data_wsp = new FormData();
        data_wsp.append('workspaces', JSON.stringify(wksSelected.wsp))
        // setWksSelected({wsp: resData.workspace ,resource_id: resData.id})
        setResource(wksSelected.wsp.map(workspace => workspace.id))
        await MainService().setWorkspaceResource(wksSelected.resource_id, data_wsp)
    }

    setLoaded(false)
    setProcessing(false)

    setForm(resData.data);
    setMessage({display: true, text: output_message, ok: ouput_ok })
  }

  const getStoreFormData = () => {
    let fd = store.getState().app.formData;
    if(firstAction){
       fd = {name:""}
       setFirstAction(false)
    }
    return fd;
  }


  const metaData = { menuItem: 'Main Data', render: () => <Tab.Pane > <MainData /></Tab.Pane> };
  const lomsData = VALIDS_LOM.map(typeLom => ({menuItem: typeLom.name, render: () => (<Tab.Pane><LomForm data={dataForUpdate} standard={typeLom.key}/></Tab.Pane>)}))
  const mediaData = { menuItem: "Media data", render: () => <Tab.Pane > <MediaData url={resourceData?.files?.[0].dam_url} description="test" transcription="Test" xtags={[]}/> </Tab.Pane> };
  const cdnData = { menuItem: "CDN data", render: () => <Tab.Pane > <CDNData data={dataForUpdate?.data?.cdns_attached ?? []}/> </Tab.Pane> };

  const pane = [metaData];
  let panes = [metaData, ...lomsData];
  if(resourceType === MULTIMEDIA) {
    panes = [...panes,mediaData]
  }
  if (dataForUpdate?.data?.cdns_attached) {
    panes = [...panes, cdnData]
  }
  const setForm = (data) => {
    dispatch(setFormData(data))
  }

  const customWidgets = {
    TextWidget: InputText,
  };

  const fields = { bookExtraData: ExtraBookData };

  const uiSchema={
    "description": {
      "ui:order": ["active", "can_download", "isFree", "*"],
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
      },
      "can_download": {
        "ui:widget": CustomToggle,
        "ui:options": {
            label: "Can download?"
        }
      },
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

  const handleUpgradeResource = async () => {
    setMessage(messageDefaultState)
    const res = await MainService().upgradeResourceScorm(resourceData.id)
    setMessage({display: true, ok: res.status === 'OK', text: res.message ?? 'Error 0' })
  }

  const saveMetaDataResource = async () => {
    const data = formulario?.current?.state?.formData?.description ?? resourceData?.data?.description
    data.id = resourceData.id
    data.theme = resourceData.theme

    // if (resourceData.version === 1) data.upgrading = true

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

  const handleResourceAccessibility = (_, {checked}) => {
    setAccessibility(checked)
  }

  const handleDuplicate = async () => {
    if(canDuplicate){
      setProcessingDuplicate(true);
      let output_ok = false;
      let output_message = "";
      try {
        const res = await MainService().duplicateResource(resourceData.id);
        if (res.error) throw new Error(res.error)
        output_ok = true
        output_message = "Resource Duplicated successfully"
      } catch (error) {
        output_message = 'Error 0: ' + error.message;
      } finally {
        setProcessingDuplicate(false);
        setCanDuplicate(false);
        setMessage({display: true, ok: output_ok, text: output_message})
        localStorage.setItem('reload_catalogue', '1');
        setTimeout(() => {
          setCanDuplicate(true);
        }, 10000);
      }
    }

  }

  const MetaDataForm = () => {
    return (
      <Grid item sm={6} style={{paddingBottom: '20em'}}>
        <div className='forms-main-btns'>
            <Btn color='teal' icon='facebook' onClick={() =>  _refForm.current.click()} loading={processing}>
              {dataForUpdate ? (
                <><Icon name='save' /> Save</>
              ) : (
                <><Icon name='save' /> Submit</>
              )}
            </Btn>
            {(action === 'edit' && showDuplicateButton)  &&
            (<Btn color={canDuplicate ? 'teal' : 'grey'} icon='facebook' onClick={() =>  handleDuplicate()} loading={processingDuplicate}>
              <><Icon name='copy' /> Duplicate</>
            </Btn>)}
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
              <Btn color='teal' onClick={handleUpgradeResource} ><Icon name='angle double up' /> Upgrade</Btn>
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
                    {typeof msg.text == 'string' ? <p>{msg.text}</p> : msg.text}
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
        {resourceType === 'book' && action !== 'create' && (
            <div className='form-theme' style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingInline: 20}}>
                <label style={{fontWeight: 'bold', fontSize: 16}}><span style={{ color: 'tomato', fontSize: '1rem'}}>Test</span> Enable Accessibility: </label>
                <Radio toggle defaultChecked={accessibility} onClick={handleResourceAccessibility}/>
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

    // setMaxFiles(appData?.max_files);
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
                <ResourceActionButtons resource={dataForUpdate} themeBook={resourceData?.theme ?? DEFAULT_THEME_BOOK} accessibility={accessibility}/>
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
                <WorkspaceSelect
                    resourceData={resourceData}
                    dataForUpdate={dataForUpdate}
                    handleWorkspaceSelected={handleWorkspaceSelected}
                    newWorkspaces={wksSelected.wsp}
                />
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
            {/* <CDNsAttachedToResourceV2
              resourceData={resourceData}
              formData={appData}
            /> */}
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
