import React from 'react'

import { Tab } from "semantic-ui-react";
import { VALIDS_LOM } from "../../../../constants";
import LomForm from "../../LOM/LomForm";
import { useState } from "react";
import { Grid } from "@material-ui/core";

const DynamicFormTabs = (props) => {
    const metaData = { menuItem: 'Main Data', render: () => <Tab.Pane > {<props.mainData/>}</Tab.Pane> };
    const lomsData = !props.showLom ? [] : VALIDS_LOM.map(typeLom => ({menuItem: typeLom.name, render: () => (<Tab.Pane><LomForm data={props.dataForUpdate} standard={typeLom.key}/></Tab.Pane>)}))
    const pane = [metaData];
    const panes = [metaData];
    //const [panes, setPanes] = useState([metaData, ...lomsData])
    console.log(props.mainData);
    return (
         
        <Grid item sm={12} id='form-content'>
          
          {props.dataForUpdate && props.action === 'edit' ? (<Tab panes={panes} />) : (<Tab panes={pane} />)}
          
          test
        </Grid>
           
          
    )
}

export default DynamicFormTabs;