import React from 'react';
import {
    Button,
    DialogContent,
    DialogContentText,
    ButtonGroup,
    Grid,
    Card,
    Icon
  } from '@material-ui/core';
import RelatedFiles from '../RelatedFiles';
import { Label } from 'semantic-ui-react';
import ResourceActionButtons from '../ResourceActionButtons';
import useStyles from './DynamicFormStyles';
import { MULTIMEDIA } from '../../../../constants';


const FilesAndActions = (props) => {
    const classes = useStyles();
    
    return (
      <Grid item sm={6}>
          <ButtonGroup orientation='vertical'>
            <Grid item sm={12} style={{ minWidth: 400 }}>
              <span
                className={`${classes.addPreview}`}
              >Upload preview image</span>
              <Button
                className={`${classes.btnPreview}`}
                component="label"
                style={props.styleBtnPreview}
                fullWidth
                variant='outlined'
              >
                <input
                  accept="image/*"
                  type="file"
                  onChange={(e)=> props.handleFiles(e)}
                  name='Preview'
                  hidden
                />
              </Button>
            </Grid>
            <Grid item sm={12} style={{"paddingTop":"1.25rem"}}>
                    <Button variant="outlined" component="label" fullWidth>
                        Attach files
                        <input
                            type="file"
                            multiple
                            accept={
                                props.resourceType === MULTIMEDIA
                                    ? "audio/*,video/*,image/*"
                                    : "*"
                            }
                            onChange={(e) => props.handleFiles(e)}
                            name="File"
                            hidden
                        />
                    </Button>
                    {/* {resourceType === MULTIMEDIA ? (
                  <Label> You will upload a {mediaType}</Label>
              ) : null} */}
                </Grid>
            <Grid item sm={12} className={classes.divider}>
              {props.dataForUpdate ? (
                <ButtonGroup orientation='horizontal' fullWidth id='forms-btn-actions'>    
                   {/*} <ResourceActionButtons resource={props.dataForUpdate} />*/}
                </ButtonGroup>
              ) : null}
            </Grid>

          </ButtonGroup>
          <div style={{ margin: '15px 42px 0px 0px' }}>
            {
              (props.action === 'view' || props.action === 'edit' )  && props.dataForUpdate?.data?.description?.image == '' ? (
                <RelatedFiles
                  resData={props.resourceData}
                  files={props.theFiles}
                  withPlayer
                  onEditModal
                  setTheFiles={props.setTheFiles}
                  DynamicFormResourceData={props.setResourceData}
                />
              ) : <img src={props.dataForUpdate?.data?.description?.image} className={classes.imgView} />
            }
            
            {
              props.formFiles && props.formFiles.length > 0 ? (
                <>
                  <Label>Adding:</Label>
                  {
                    Array.from(props.formFiles).map((f, i) => (
                      <Card variant='outlined' className='associated-files-card' key={i}>
                        <Icon name={props.iconHandler(f)}></Icon>
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
export default FilesAndActions;