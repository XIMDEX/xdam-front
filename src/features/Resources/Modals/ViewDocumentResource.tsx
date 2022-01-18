import React, { useEffect, useState } from 'react';
import {
  Grid, Card, Accordion, AccordionSummary, AccordionDetails
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import MainService from '../../../api/service';

import { render, renderFromUrl } from '../../../utils/render';
import RelatedFiles from './RelatedFiles';
import { Button, Icon, Label } from 'semantic-ui-react';
import _ from 'lodash';
import SemanticForm from "@rjsf/semantic-ui";
import { JSONSchema7 } from 'json-schema';
import { useSelector } from 'react-redux';
import { selectSchemas } from '../../../appSlice';
import { BOOK, MULTIMEDIA, IMAGE, VIDEO, AUDIO, COURSE, ACTIVITY, ASSESSMENT } from '../../../constants';
import ArrayFieldTemplate from './DynamicFormTemplates/ArrayFieldTemplate';
import { selectCollection } from '../../../slices/organizationSlice';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import './ViewDocumentResource.css';


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

export default function ViewDocumentResource( { resData } ) {
    const classes = useStyles();
    const { id } = resData;
    const [resourceData, setResourceData] = useState(null)
    const [resourceDataFacet, setResourceDataFacet] = useState(null)
    const coll = useSelector(selectCollection);
    const [entities_linked, setEntities_linked] = useState(null);
    const [linked_loaded, setLinked_loaded] = useState(false);
    const [entities_non_linked, setEntities_non_linked] = useState(null);
    const [body, setBody] = useState([resData.body]);
    const [allEntities, setAllEntities] = useState([]);
    
    const [expanded, setExpanded] = useState('');

    const handleChange = (panel) => (event, isExpanded) => {
      setExpanded(isExpanded ? panel : false);
    };

    useEffect(() => {
        const getResourceData = async () => {
            let res = await MainService().getResource(id);
            setResourceData(res);
        }

        const getResourceDataFaceted = async () => {
          let resFacet = await MainService().getCatalogue(coll, '?facets[id]='+id);
          setResourceDataFacet(resFacet.data[0]);
      }

        getResourceData();
        getResourceDataFaceted();
    }, [])

    useEffect(()=> {
      if (resourceDataFacet !== null) {
        setEntities_linked(resourceDataFacet?.data?.description?.entities_linked ?? []);
        setEntities_non_linked(resourceDataFacet?.data?.description?.entities_non_linked ?? []);
        const allEntities = [
          ...resourceDataFacet?.data?.description?.entities_linked, 
          ...resourceDataFacet?.data?.description?.entities_non_linked
        ];
        allEntities.sort((a,b) => a.start - b.start);
        setAllEntities(allEntities);
        setBody([resourceDataFacet.data.description.body]);
      }
    }, [resourceDataFacet])

    useEffect(()=> {
      if (entities_linked !== null) {
        const entities = [...allEntities];

        const reverse = entities.reverse();
        let stringBody = body[0];
        let newBody = [];

        let endBody = stringBody.lenght
        reverse.forEach((entity) => {
          let end = stringBody.substr(entity.end, endBody);
          // let text_entity = stringBody.substr(entity.start, (entity.end - entity.start - 1));
          let start = stringBody.substr(0, entity.start)
          stringBody = start;
          endBody = entity.end;
          newBody = [highlightEntities(entity), <span> {end}</span>, ...newBody]
        })
        newBody = [<span>{stringBody }</span>, ...newBody];
        setBody(newBody)
      }
    }, [entities_linked])

    useEffect(()=> {
      if (entities_non_linked !== null && linked_loaded) {
        const reverse = [...entities_non_linked].reverse();
        let stringBody = body[0];
        let newBody = [];

        let endBody = stringBody.lenght
        reverse.forEach((entity) => {
          let end = stringBody.substr(entity.end, endBody);
          // let text_entity = stringBody.substr(entity.start, (entity.end - entity.start - 1));
          let start = stringBody.substr(0, entity.start)
          stringBody = start;
          endBody = entity.end;
          newBody = [highlightEntities(entity), <span> {end}</span>, ...newBody]
        })
        newBody = [<span>{stringBody }</span>, ...newBody];
        setBody(newBody)
      }
    }, [entities_non_linked, linked_loaded])


    let preview = resData.data.description.image || render(resData, 'medium')

    const closeModal = () => {
      let element: HTMLElement = document.getElementsByClassName('MuiBackdrop-root')[0] as HTMLElement;
      element.click();
    }


    const copied = (e, a) => {
      var x = e.clientX;
      var y = e.clientY;
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
                  <CopyToClipboard text={process.env.REACT_APP_API_BASE_URL + '/resource/render/' + dam_url}>
                    <span>{dam_url}</span>
                  </CopyToClipboard>
                </li>
              ))}
            </ul>
          </>)
        }
      }
          
      return (
        field 
      )
    }

    const highlightEntities = (entity) => {
      const key = `${entity.name}_${entity.start}_${entity.end}`
      return entity.uri ? (
        <a 
          key={key} 
          target='_blank' 
          title={`Type: ${entity.type} \nEntity: ${entity.name}${entity.uri ? '\nURL: ' + entity.uri : ''}`}
          href={entity.uri} 
          style={{
            backgroundColor: getColorEntities(entity.type), 
            // opacity: (expanded !== entity.type ? 0.5 : 1),
            padding: '1px 7px',
            borderRadius: 5,
            fontWeight: 'bold',
            color: 'black'
          }}
        >{entity.name}</a>
      ) : (
        <span 
          title='prueba'
          key={key} 
          style={{
            backgroundColor: getColorEntities(entity.type), 
            // opacity: (expanded !== entity.type ? 0.5 : 1),
            padding: '1px 7px',
            borderRadius: 5,
            fontWeight: 'bold'
          }}
        >{entity.name}</span>
      )
    }

    return (
      <Grid container>
        <Grid container justify='flex-end' >
          <Button circular onClick={closeModal} icon='close' color='teal' className='read-card-close-button' />
        </Grid>
        {resourceData !== null && (
          <>
            <Grid item sm={12} style={{paddingLeft: 20, paddingRight: 20}} >
            {resourceDataFacet !== null &&  <h2>{resourceDataFacet.title}</h2> }
            </Grid>
            <Grid container  justify='space-around'  >
              <Grid  sm={5}>
                <div style={{backgroundImage: 'url('+preview+')', marginTop: 14}} className={classes.imgView}/>
              </Grid>
              <Grid  sm={6}>
                  <Grid container spacing={3}>
                    <Grid item sm={resourceData.files?.length > 0 ? 7 : 12}>
                      {resourceDataFacet !== null && (
                          <>
                            <Card variant='outlined' style={{marginTop: 14, padding: 12}}>
                              {Object.keys(resourceDataFacet).map((e, i) => {
                                if (e == 'body' || e == 'entities_linked' || e == 'entities_non_linked' || e == 'title') return null;
                                return (
                                  <div key={i} className='resource-metadata'>
                                    {renderField(e, resourceDataFacet[e])}
                                  </div>
                                )
                              })}
                            </Card>
                          </>
                        )}
                    </Grid>
                  </Grid>
              </Grid>        
            </Grid>
            <Grid container justify='space-around' >
              
              <Grid item sm={8}>
                <Card  variant='outlined' style={{padding: 10}}>
                  {body.map((e,i)=> {
                    return e
                  })}    
                </Card>
              </Grid>
              <Grid item sm={3}>
                <Accordion style={{backgroundColor: getColorEntities('Person')}}  expanded={expanded === 'Person'} onChange={handleChange('Person')}>
                  <AccordionSummary id='xtags-person'>
                    <div>
                      <Icon name='user circle' size='big' color='grey' className='icon-xtags icon-xtags-person' /> 
                      <span style={{marginLeft: 10}}>PERSONAS</span>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails style={{backgroundColor: 'white'}}>
                    <ul>
                      {allEntities?.filter(entity =>(entity.type == 'Person')).map((e, i) => {
                        return (
                          <li key={e.name + '_' + i}>
                            {
                              e.uri 
                                ? ( <a href={e.uri} target='_blank'>{e.name}</a> ) 
                                : e.name
                            }
                          </li>
                        )
                      })}
                    </ul>
                  </AccordionDetails>
                </Accordion>
                <Accordion style={{backgroundColor: getColorEntities('Place')}}  expanded={expanded === 'Place'} onChange={handleChange('Place')}>
                  <AccordionSummary id='xtags-place'>
                    <div>
                      <Icon name='map marker alternate' size='big'  color='grey'  className='icon-xtags icon-xtags-person' /> 
                      <span style={{marginLeft: 10}}>LUGARES</span>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails style={{backgroundColor: 'white'}}>
                    <ul>
                      {allEntities?.filter(entity =>(entity.type == 'Place')).map((e, i) => {
                        return (
                          <li key={e.name + '_' + i}>
                            {
                              e.uri 
                                ? ( <a href={e.uri} target='_blank'>{e.name}</a> ) 
                                : e.name
                            }
                          </li>
                        )
                      })}
                    </ul>
                  </AccordionDetails>
                </Accordion>
                <Accordion style={{backgroundColor: getColorEntities('Other')}}  expanded={expanded === 'Other'} onChange={handleChange('Other')}>
                  <AccordionSummary id='xtags-person'>
                    <div>
                      <Icon name='tags' size='big'  color='grey'  className='icon-xtags icon-xtags-person' /> 
                      <span style={{marginLeft: 10}}>OTROS</span>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails style={{backgroundColor: 'white'}}>
                    <ul>
                      {allEntities?.filter(entity =>(entity.type == 'Other')).map((e, i) => {
                        return (
                          <li key={e.name + '_' + i}>
                            {
                              e.uri 
                                ? ( <a href={e.uri} target='_blank'>{e.name}</a> ) 
                                : e.name
                            }
                          </li>
                        )
                      })}
                    </ul>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
    )
  }

  
export const getColorEntities = (type) => {
    let backgroundColor;
    switch (type) {
      case 'Person':
        backgroundColor = '#f78181'
        break;
      case 'Place':
        backgroundColor = '#6acf97'
        break;
      case 'Other':
      case 'Things':
        backgroundColor = '#669cff' 
        break;
      case 'Corporations':
      case 'Institutions':
        backgroundColor = '#edbc63' // 
        break;
      default:
        backgroundColor = ' #fff' // #fff
        break;
    }
    return backgroundColor;
}