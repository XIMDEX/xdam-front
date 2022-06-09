import React, { useEffect, useState, useRef, createRef, useContext } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { FileDrop } from 'react-file-drop';
import { Button as Btn, Input, Message, Label, Icon, Radio, Segment, Button } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import { reloadCatalogue } from '../../../../appSlice';
import api from '../../../../api/urlMapper';
import MainService from '../../../../api/service';
import { selectCollection } from '../../../../slices/organizationSlice';
import axios from 'axios';
import MultipleValueTextInput from '../../../../components/forms/MultipleValueTextInput/MultipleValueTextInput';
import { MULTIMEDIA, BOOK } from '../../../../constants';
import ResourceLanguageWrapper from '../../../../components/forms/ResourceLanguageWrapper/ResourceLanguageWrapper';
import DropContent from './DropContent';
import RequiredValuesContext, { RequireValues } from './RequiredValuesContext';

export default function BatchDialog( {open, setOpenBatch, action, resourceType} ) {
    const [files, setFiles] = useState(null);
    const [workspace, setWorkspace] = useState(null);
    const [newWorkspace, setNewWorkspace] = useState('');
    const [focus, setFocus] = useState(null);
    const [message, setMessage] = useState(null);
    const [server, setServerConf] = useState(null);
    const [progress, setProgress] = useState(null);
    const [highlighted, highlightArea] = useState(false);
    const [uploaded, filesUploaded] = useState(false);
    const [errorOnUpload, setErrorOnUpload] = useState(null);
    const fileInputRef = useRef(null);
    const collection = useSelector(selectCollection);
    const dispatch = useDispatch();
    //const workspaces = useSelector(selectUser).data.selected_org_data.workspaces;
    const [genericData, setGenericData] = useState({});
    const [filesInfo, setFilesInfo] = useState<Record<string, any>>({});
    const [requiredFields, setRequiredFields] = useState<RequireValues>({
        conversionAfterUpload: false
    });

    useEffect(() => {
        
        console.log('UPDATED')

        const get_post_max_size = async () => {
            let res = await axios.get(api().baseUrl + '/ini_pms', {
                headers: {
                    authorization: api().auth,
                }
            });
            console.log(res);
            if(res.status === 200) {

                setServerConf(res.data);
            }
        }
        
        get_post_max_size();
        
    }, [uploaded])

    const updateGenericDataFor = (key: string): (data: any) => void => {
        return (data: any) => {
            setGenericData({...genericData, [key]: data})
        }
    }

    const toggleRequiredFields = (fields: keyof RequireValues) => {
        return (event) => {
            event.preventDefault();

            setRequiredFields({
                ...requiredFields,
                [fields]: !requiredFields?.[fields]
            });
        }
    }

    const onFileInputChange = (event) => {
        const { files } = event.target;
        setFiles(Array.from(files));
    }


    const handleClose = () => {
        setFiles(null);
        setFocus(null);
        filesUploaded(false);
        setProgress(null);
        setErrorOnUpload(null);
        setOpenBatch(false);
        setGenericData({});
        setFilesInfo({});
        setRequiredFields({
            conversionAfterUpload: false
        })
    };

    const handleOnEntered = () => {
        setNewWorkspace(now());
    }

    const onTargetClick = () => {
        fileInputRef.current.click()
    }

    const handleUpload = async () => {
        filesUploaded(false);
        let fd = new FormData();
        if (workspace === null && newWorkspace === '') {
            //error. Select one
            setMessage('Please select one Workspace');
            return;
        }

        fd.append('collection', collection.toString());
        
        // if(workspace) {
        //     fd.append('workspace', workspace.id);
        //     fd.append('create_wsp', '0');
        // } else {
        //     fd.append('workspace', newWorkspace);
        //     fd.append('create_wsp', '1');
        // }

        fd.append('workspace', newWorkspace);
        fd.append('create_wsp', '1');

        if (Object.keys(genericData).length > 0) {
            fd.append('generic', JSON.stringify(genericData));
        }

        if (Object.keys(filesInfo).length > 0) {
            for(const fileName of Object.keys(filesInfo)) {
                const info = filesInfo[fileName];

                if(info['preview']) {
                    fd.append(`${fileName}_preview`, info['preview']);
                    delete filesInfo[fileName]['preview'];
                }
            }

            fd.append('filesInfo', JSON.stringify(filesInfo));
        }

        for (var i = 0; i < files.length; i++) {
            fd.append('files[]', files[i]);
        }
        
        const { request, _api } = await MainService().createBatchOfResources(fd);
        const config = {
            onUploadProgress: progressEvent => {
              //console.log(progressEvent)
              let progress = (progressEvent.loaded / progressEvent.total) * 100;
              setProgress(progress);
            },
            headers: request.headers
          }
          
        axios.post(_api.url, fd, config).then(res => {
            
            if (res.status == 200) {
                console.log("done: ", res.data.message);
                filesUploaded(true);
                dispatch(reloadCatalogue())
            }
          }).catch(err => {
            filesUploaded(true);
            setErrorOnUpload("error: " + err.message);
            console.log("error: ", err.message);
        })
        
    }

    const changeWorkspace = (event, data) => {
        event.preventDefault();

        setNewWorkspace(data.value);

        if(resourceType === BOOK) {
            updateGenericDataFor('isbn')(data.value);
        }
    }

    function now () {
        var today = new Date();
        var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
        var time = today.getHours()+'_'+today.getMinutes()+'_'+today.getSeconds();
        console.log(date + ' '+ time);
        return 'Batch ' + date + ' '+ time;
        // const timeElapsed = Date.now();
        // const today = new Date(timeElapsed);
        // return today.toDateString(); // "Sun Jun 14 2020"
    }

    const newBatch = () => {
        setFiles(null);
        setErrorOnUpload(null);
        setProgress(null);
        filesUploaded(false);
        setNewWorkspace(now());
    }

    const filesModified = (updatedFiles) => {
        setFiles(updatedFiles);

        if (updatedFiles.length < 1) {
            setFiles(null);
            setProgress(null);
            filesUploaded(false);
            return;
        }
    }

    return (
        <div>
            <Dialog 
                open={open} 
                onEntered={handleOnEntered}
                onChange={()=> console.log('CHANGED')}
                onClose={handleClose} 
                aria-labelledby="batch-dialog"
                fullWidth
                maxWidth={'md'}
                
            >
                <DialogTitle >New batch</DialogTitle>
                <DialogContent style={{height: '100vh'}}>
                    <RequiredValuesContext.Provider value={requiredFields}>
                    <Btn icon='close' circular onClick={handleClose} color="teal" className='read-card-close-button'/>    
                    
                    <DialogActions >
                        {resourceType === BOOK && 
                            <Btn as='div' labelPosition='left' onClick={toggleRequiredFields('conversionAfterUpload')} >
                                <Label as='a' basic pointing='right'>
                                    Convert after upload
                                </Label>
                                {requiredFields.conversionAfterUpload ?
                                    <Btn icon color='green'>
                                        <Icon name='check' />
                                    </Btn>
                                    :
                                    <Btn icon color='red'>
                                        <Icon name='close' />
                                    </Btn>
                                }
                            </Btn>
                        }
                        <Btn 
                                disabled={files === null}
                                onClick={uploaded ? newBatch : handleUpload} 
                                color="teal"
                                loading={progress && !uploaded}    
                            >
                                {uploaded ? (
                                    <><Icon name='repeat'/> New batch</>
                                ) : (
                                    <><Icon name='save' /> Upload</>
                                )}
                            </Btn>
                    </DialogActions>
                    <div className='batch-form'>
                        {/* <Message> Select one Workspace </Message>
                        <Message 
                            hidden={message === null}
                            warning 
                            onDismiss={() => setMessage(null)}
                        >{message}</Message>
                        <Segment size='large'>
                            
                            <Grid columns={2} relaxed='very' stackable textAlign='center'>
                                <Grid.Column>
                                    <Dropdown
                                        style={focus === 'new' ? {opacity: 0.5} : {opacity: 1}}
                                        text={workspace ? workspace.name : 'Select one'}
                                        color='teal'
                                        button
                                        onFocus={() => {
                                            setFocus('exist')
                                            setNewWorkspace('');
                                        }}
                                    >
                                        <Dropdown.Menu>
                                            {
                                                workspaces.map(wsp => (
                                                    <Dropdown.Item onClick={() => setWorkspace(wsp)}>
                                                        {wsp.name}
                                                    </Dropdown.Item>
                                                ))
                                            }
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Grid.Column>
                                <Grid.Column verticalAlign='middle'>
                                    <Input 
                                        style={focus === 'exist' ? {opacity: 0.5} : {opacity: 1}}
                                        placeholder='Create a new one' 
                                        onFocus={() => {
                                            setFocus('new')
                                            setWorkspace(null)
                                        }}
                                        onChange={(e, d) => {
                                            setNewWorkspace(d.value)
                                        }}
                                        value={newWorkspace}
                                    />
                                </Grid.Column>
                            </Grid>
                            <Divider vertical>Or</Divider>
                        </Segment> */}
                        <Message info >
                            <span style={{marginRight: '10px'}}>
                                { resourceType === BOOK
                                    ? 'It will asociate the resource to the ISBN:'
                                    : 'It will create a new Workspace named:'
                                }
                                <Input 
                                    size='small'
                                    style={(focus === 'exist' ? {minWidth: 200, opacity: 0.5, marginLeft: 10} : {minWidth: 200, opacity: 1, marginLeft: 10})}
                                    placeholder='Create a new one' 
                                    onFocus={() => {
                                        setFocus('new')
                                        setWorkspace(null)
                                    }}
                                    onChange={changeWorkspace}
                                    value={newWorkspace}
                                />
                            </span>
                            { resourceType === BOOK &&
                                <div style={{ display: 'inline-block' }}>
                                    <span>And with the language</span>
                                    <ResourceLanguageWrapper
                                        value={genericData['lang']}
                                        onChange={updateGenericDataFor('lang')}
                                    />
                                </div>
                            }
                        </Message>
                        <Message warning> LIMIT: A total of {server?.pms}{server?.pms.includes('M') || server?.pms.includes('m') ? 'B' : 'MB'} in no more than {server?.mfu} files per batch</Message>
                        
                        {resourceType === MULTIMEDIA
                            &&
                            (<div style={{ display: 'grid', gridTemplateColumns: '50% 50%', columnGap: '1rem' }}>
                                <MultipleValueTextInput name='Tags' setData={updateGenericDataFor('tags')} />
                                <MultipleValueTextInput name='Categories' setData={updateGenericDataFor('categories')} />
                            </div>)
                        }
                    </div>

                    
                    
                    <div
                        style={files ? {} : {cursor: 'pointer'}} 
                        className={highlighted ? 'batch-drop-area bda-highlight' : 'batch-drop-area'}
                    >
                        
                        <FileDrop
                            onFrameDragEnter={(event) => {
                                //console.log('onFrameDragEnter', event);
                                highlightArea(true)
                            }} //in
                            //onFrameDragLeave={(event) => console.log('onFrameDragLeave', event)}
                            onFrameDrop={(event) => {
                                console.log('onFrameDrop', event);
                                highlightArea(false)
                            }} //drop
                            //onDragOver={(event) => console.log('onDragOver', event)}
                            //onDragLeave={(event) => console.log('onDragLeave', event)}
                            onDrop={(files, event) => {
                                console.log('onDrop!', files, event); 
                                setProgress(null);
                                filesUploaded(false);
                                setFiles(Array.from(files))
                            }}
                            onTargetClick={files ? null : onTargetClick}
                        >
                            {files ?
                                
                                    <DropContent
                                        files={files}
                                        updateFiles={filesModified}
                                        progress={progress}
                                        uploaded={uploaded}
                                        errorOnUpload={errorOnUpload}
                                        resourceType={resourceType}
                                        filesInfo={filesInfo}
                                        setFilesInfo={setFilesInfo}
                                    />
                                :
                                <>
                                    <div className='label-drop'>
                                        <p>
                                            <Label>Click or Drop here </Label>
                                        </p>
                                    </div>
                                    <input
                                        onChange={onFileInputChange}
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        hidden
                                    />
                                </>
                            }  
                        </FileDrop>
                    </div>
                    </RequiredValuesContext.Provider>
                </DialogContent>
            </Dialog>
        </div>
    );
}
