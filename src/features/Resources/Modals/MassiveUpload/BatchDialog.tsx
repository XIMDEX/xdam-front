import React, { useEffect, useState, useRef } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { FileDrop } from 'react-file-drop';
import { Button as Btn, Input, Message, Label, Icon, Divider, Segment, Grid, Dropdown } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import { reloadCatalogue } from '../../../../appSlice';
import api from '../../../../api/urlMapper';
import MainService from '../../../../api/service';
import { selectCollection } from '../../../../slices/organizationSlice';
import axios from 'axios';
import MultipleValueTextInput from '../../../../components/forms/MultipleValueTextInput/MultipleValueTextInput';
import { MULTIMEDIA, BOOK, DOCUMENT } from '../../../../constants';
import ResourceLanguageWrapper from '../../../../components/forms/ResourceLanguageWrapper/ResourceLanguageWrapper';
import DropContent from './DropContent';
import WorkspaceSelect from '../../../../components/forms/WorkspaceSelect/WorkspaceSelect';

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
    const [genericData, setGenericData] = useState({lang: 'en'});
    const [filesInfo, setFilesInfo] = useState<Record<string, any>>({});
    const [workspaces, setWorkspaces] = useState([]);

    useEffect(() => {
        const get_post_max_size = async () => {
            let res = await axios.get(api().baseUrl + '/ini_pms', {
                headers: {
                    authorization: api().auth,
                }
            });
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
        setGenericData({lang: 'en'});
        setFilesInfo({});
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

        fd.append('workspace', newWorkspace);
        fd.append('workspaces', JSON.stringify(workspaces))
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

    const handleWsp = (data) => {
        setWorkspaces(data.wsp.map(e => e.id));
    }

    function now () {
        var today = new Date();
        var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
        var time = today.getHours()+'_'+today.getMinutes()+'_'+today.getSeconds();
        return 'Batch ' + date + ' '+ time;
    }

    const newBatch = () => {
        setFiles(null);
        setErrorOnUpload(null);
        setProgress(null);
        filesUploaded(false);
        setNewWorkspace(now());
        setWorkspaces([])
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
                onClose={handleClose}
                aria-labelledby="batch-dialog"
                fullWidth
                maxWidth={'md'}
            >
                <DialogTitle >New batch</DialogTitle>
                <DialogContent style={{height: '100vh'}}>
                    <Btn icon='close' circular onClick={handleClose} color="teal" className='read-card-close-button'/>


                    <DialogActions >
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
                        <Message  info >
                            <div style={{display: 'flex', flexDirection: 'row', alignItems:'center'}}>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        flexGrow: 1,
                                        alignItems: 'center',
                                        paddingTop: 8,
                                    }}
                                >
                                    <span style={{marginRight: '10px'}}>
                                        It will asociate the resource to the {resourceType === BOOK ? 'ISBN' : 'Workspace'}:
                                    </span>
                                    <div
                                        style={{
                                            flexGrow: 1,
                                            maxWidth: 300
                                        }}
                                    >
                                        <WorkspaceSelect
                                            resourceData={null}
                                            dataForUpdate={null}
                                            handleWorkspaceSelected={handleWsp}
                                            newWorkspaces={[]}
                                        />
                                    </div>
                                </div>
                            { (resourceType === BOOK || resourceType === DOCUMENT) &&
                                <div style={{ display: 'inline-block' }}>
                                    <span>And with the language</span>
                                    <ResourceLanguageWrapper
                                        value={genericData['lang']}
                                        onChange={updateGenericDataFor('lang')}
                                    />
                                </div>
                            }
                            </div>
                        </Message>
                        <Message warning> LIMIT: A total of {server?.pms}{server?.pms.includes('M') || server?.pms.includes('m') ? 'B' : 'MB'} in no more than {server?.mfu} files per batch</Message>

                        {resourceType === MULTIMEDIA && (
                            <div style={{ display: 'grid', gridTemplateColumns: '50% 50%', columnGap: '1rem' }}>
                                <MultipleValueTextInput name='Tags' setData={updateGenericDataFor('tags')} />
                                <MultipleValueTextInput name='Categories' setData={updateGenericDataFor('categories')} />
                            </div>
                        )}
                    </div>



                    <div
                        style={files ? {} : {cursor: 'pointer'}}
                        className={highlighted ? 'batch-drop-area bda-highlight' : 'batch-drop-area'}
                    >

                        <FileDrop
                            onFrameDragEnter={(event) => highlightArea(true) } //in
                            onFrameDrop={(event) => highlightArea(false) } //drop
                            onDrop={(files, event) => {
                                setProgress(null);
                                filesUploaded(false);
                                setFiles(Array.from(files))
                            }}
                            onTargetClick={files ? null : onTargetClick}
                        >
                            {files ? (
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
                            ) : (
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
                            )}
                        </FileDrop>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
