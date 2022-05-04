import { Card, createStyles, makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import { useContext } from "react";
import { Icon, Label, List } from "semantic-ui-react";
import { FormAction, ResourceMetaDataForm } from "./ResourceFormContext";
import { renderFromUrl } from '../../../../utils/render';
import { iconHandler } from "../../../../utils/iconHandler";
import MainService from '../../../../api/service';

const useStyles = makeStyles(() =>
    createStyles({
        imgView: {
            width: '100%',
            margin: '0 auto',
            display: 'block'
        },
        mediaPlayer: {
            width: '100%'
        },
        filesList: {
            '& p': {
                '& span': {
                    fontWeight: 'bold'
                }
            }
        }
    }),
);

const MediaPlayer = ({ mime_type, url }) => {
    const classes = useStyles();
    let player;
    let src;
    if (mime_type.includes('video')) {
        src = renderFromUrl(url, 'raw');
        player = (<video controls className={classes.mediaPlayer}> <source src={src} /></video>)
    } else if (mime_type.includes('image')) {
        src = renderFromUrl(url, '');
        player = (<img src={src} className={classes.mediaPlayer} />)
    } else if (mime_type.includes('audio')) {
        src = renderFromUrl(url, '');
        player = (<audio controls> <source src={src} /> </audio>)
    }
    else {
        player = (<p>Mime type not supported</p>)
    }

    return (
        <>
            {player}
        </>
    )
}

const MediaControlls = ({fileId, fileName, fileMimeType, resourceId, fileUrl}) => {
    const { dispatch } = useContext(ResourceMetaDataForm);

    const View = () => {
        const [show, setShow] = useState(false);

        return (
            <>
                <a onClick={() => setShow(!show)}>View </a>
                {show && <MediaPlayer mime_type={fileMimeType} url={fileUrl} />}
            </>
        );
    }

    const Download = () => {
        return (<a onClick={() => MainService().downloadFileFromUrl(fileName, fileUrl)}>Download</a>);
    }

    const Remove = () => {
        async function removeFile(resourceId: string, fileName: string, fileId?: string) {
            if(!fileId) {
                dispatch({ type: 'fileRemoved', payload: {filterBy: 'name', value: fileName} });
                return;
            }
            
            await MainService().removeMedia(resourceId, fileId);
            dispatch({ type: 'fileRemoved', payload: { filterBy: 'id', value: fileId } });
        }
        
        return (
            <a onClick={() => removeFile(resourceId, fileName, fileId)} style={{ color: 'red' }}> Remove </a>
        );
    }

    return (
        <div className="relatedFiles-ul">
            <View />
            {fileId && <> | <Download /></> }
            {resourceId && fileId && <> | <Remove /></> }
        </div>
    );
}

const FileGroup = ({name, files, resourceId}) => {

    if(files.length === 0) {
        return null;
    }

    return (
        <>
            <Label>{name}</Label> 
            {
                files.map((file, index) => (
                    <Card key={index} variant='outlined' className='associated-files-card'>
                        <List.Item>
                            <List.Content>
                                <Icon name={iconHandler(file)}></Icon>
                                <p><strong>File name:</strong> {file.name || file.file_name}</p>
                                <p><strong>Mime type:</strong> {file.mime_type}</p>
                                <MediaControlls
                                    fileId={file.id}
                                    fileName={file.name}
                                    fileMimeType={file.mime_type}
                                    fileUrl={file.dam_url}
                                    resourceId={resourceId}
                                />
                            </List.Content>
                        </List.Item>
                    </Card>
                ))
            }
        </>
    )
}

export const FileList = () => {
    const { state } = useContext(ResourceMetaDataForm);

    return (
        <>
            <FileGroup 
                name={state.action === FormAction.UPDATE ? 'Already attached:' : 'Associated files'}
                files={state.files.filter(file => file.id)}
                resourceId={state.resourceId}
            />
            <FileGroup
                name="Adding"
                files={state.files.filter(file => !file.id)}
                resourceId={state.resourceId}
            />
        </>
    )
}
