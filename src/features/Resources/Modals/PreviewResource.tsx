import React, { useEffect, useState } from 'react';
import {
  Grid, Card
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import MainService from '../../../api/service';

import RelatedFiles from './RelatedFiles';
import { Label } from 'semantic-ui-react';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { API_BASE_URL, WORKSPACES } from '../../../constants';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { selectWorkspacesData } from '../../../appSlice';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    imgView: {
      height: '400px',
      display: 'block',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'top',
      backgroundSize: 'cover',
      border: '1px solid #e1e1e1',
      borderRadius: 5,
      marginBottom: 15
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

const ResourceWokspaces = ({ workspacesId }: { workspacesId: Array<string> }) => {
  const workspaces = useSelector(selectWorkspacesData);

  if (!workspaces) return null;

  const resourceWorkspaces = workspacesId.map(id => workspaces[id].name);

  return (<p><strong>workspaces:</strong> {resourceWorkspaces.join(', ')}</p>)
}

export default function PreviewResource( { resData } ) {
    const classes = useStyles();
    const { id } = resData;
    const [resourceData, setResourceData] = useState(null)
    const [resourceDataFacet, setResourceDataFacet] = useState(null)
    const [preview,setPreview] = useState(null)


    useEffect(() => {
        const getResourceData = async () => {
            let res = await MainService().getResource(id);
            setResourceData(res);
            console.log(res)
        }
        getResourceData();
    }, [])

    useEffect(() => {
      const getResourceDataFaceted = async () => {
        let resFacet = await MainService().getCatalogue(resourceData.collection[0].id, '?facets[id]='+id);
       setResourceDataFacet(resFacet.data[0]);   
     }
     resourceData && getResourceDataFaceted();
     resourceData && setPreview(MainService().render(resourceData.previews[0].dam_url) + '/medium');
    },[resourceData])

    
    const closeModal = () => {
      let element: HTMLElement = document.getElementsByClassName('MuiBackdrop-root')[0] as HTMLElement;
      element.click();
    }


    const copied = (e, a) => {
      console.log(e, a)
      var x = e.clientX;
      var y = e.clientY;
      console.log(x, y)
      let exist = document.getElementById('-copied');
      const span = () => {
        var dummy = document.createElement("span");
        dummy.setAttribute('id', '-copied')
        dummy.setAttribute('style', 'position: absolute; opacity: 1; transition: all 0.15s ease-in-out; color: #555555; background: #e2e2e2; border-radius: 6px; padding: 5px; top:'+(y - 100) +'px; left:'+(x - 225)+'px;')
        dummy.innerHTML = 'Copied'
        e.target.appendChild(dummy);
        setTimeout(()=>{
          dummy.setAttribute('style', 'position: absolute; opacity: 0; transition: all 0.15s ease-in-out; color: #555555; background: #e2e2e2; border-radius: 6px; padding: 5px; top:'+(y - 100) +'px; left:'+(x - 225)+'px;')
          setTimeout(()=>{
            dummy.remove()
          }, 150)
        }, 500)
      }
      if(!exist) {
        span()
      } else {
        exist.remove()
        span()
      }


    }

    function renderField (label, d)
    {
      let field = <></>;

      if (typeof d === 'string' || typeof d === 'boolean' ) {
        if (label !== 'id') {
          field = <p><strong>{label}:</strong> {d.toString()}</p>
        }
      }

      if (Array.isArray(d)) {
        if(label !== 'organization') {
          field = <p><strong>{label}:</strong> {d.join(', ')}</p>
        }

        if(label === 'types') {
          field = <p><strong>has file types:</strong> {d.join(', ')}</p>
        }

        if(label === 'files' || label === 'previews') {
          field = (<>
            <strong>{label}:</strong>
            <ul>
              {d.map((dam_url, key) => (
                <li key={key} onClick={(evt) => copied(evt, dam_url)}>
                  <CopyToClipboard text={API_BASE_URL + '/resource/render/' + dam_url}>
                    <span>{dam_url}</span>
                  </CopyToClipboard>
                </li>
              ))}
            </ul>
          </>)
        }

        if(label === WORKSPACES) {
          field = <ResourceWokspaces workspacesId={d} />
        }
      }

      return (
        field
      )
    }

    return (
      <Grid container>
        <Grid item sm={12} style={{padding:"2rem"}}>
          {resourceData !== null && (
            <>
              <div style={{backgroundImage: 'url('+preview+')'}} className={classes.imgView}/>
              <Grid container spacing={3}>
                <Grid item sm={5} hidden={resourceData.files?.length < 1}>
                  <div>{resourceData.files?.length > 0 ? <RelatedFiles resData={resourceData} files={resourceData.files} withPlayer={true} /> : <Label>No files attached</Label>}</div>
                </Grid>
                <Grid item sm={resourceData.files?.length > 0 ? 7 : 12}>
                  <Label>Meta data</Label>
                  {
                    resourceDataFacet !== null ? (
                      <Card variant='outlined' style={{marginTop: 14, padding: 12}}>
                        {Object.keys(resourceDataFacet).map((e, i) => (
                          <div key={i} className='resource-metadata'>
                            {renderField(e, resourceDataFacet[e])}
                          </div>
                        ))}
                      </Card>
                    ) : ''
                  }
                </Grid>
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
    )
  }
