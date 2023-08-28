import React, { useEffect } from 'react'

import { Tab } from "semantic-ui-react";
import { VALIDS_LOM } from "../../../../constants";
import LomForm from "../../LOM/LomForm";
import { useState } from "react";
import { Grid } from "@material-ui/core";
import AiData from '../../Tabs/AiData';
import store from '../../../../app/store';

const DynamicFormTabs = (props) => {
    const metaData = { menuItem: 'Main Data', render: () => <Tab.Pane > {<props.mainData/>}</Tab.Pane> };
    const lomsData = !props.showLom ? [] : VALIDS_LOM.map(typeLom => ({menuItem: typeLom.name, render: () => (<Tab.Pane><LomForm data={props.dataForUpdate} standard={typeLom.key}/></Tab.Pane>)}))
    const pane = [metaData];
   // const panes = [metaData];
    const [panes, setPanes] = useState([metaData, ...lomsData])
    const storeTags = store.getState().app.formData; 
    useEffect(() => {
 

        if (typeof storeTags.description !== 'undefined' || storeTags.description !== null ){
            
          const entities = storeTags.description.entities_linked ?? "";
          const uuids = [];
          const uuidsTabs = [];
          entities.forEach(element => {
            if (uuids.indexOf(element.uuid) === -1) {
              uuids.push(element.uuid);
            }
          });
         uuids.forEach(element => {
          uuidsTabs.push({ menuItem: element, render: () => <Tab.Pane > <AiData  uuid={element} /></Tab.Pane> });
         });
      
        //  console.log(store.getState().app.formData.description.entities_linked);
      
          setPanes([...panes,...uuidsTabs])
          console.log(panes)
        }
      
      }, [])
    return (
         
        <Grid item sm={12} id='form-content'>
          {props.dataForUpdate && props.action === 'edit' ? (<Tab panes={panes} />) : (<Tab panes={pane} />)}
        </Grid>
           
          
    )
}

export default DynamicFormTabs;