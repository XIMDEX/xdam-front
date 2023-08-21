import { Tabs } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import TabPanel from './components/TabPanel/TabPanel';
import useLomSchema from './hooks/useLomSchema';
import useStyles from './hooks/useStyles'
import SemanticForm, { ArrayFieldTemplate } from "@rjsf/semantic-ui";
import { JSONSchema7 } from 'json-schema';
import { Button } from 'semantic-ui-react';
import { Tab } from '@material-ui/core';
import LomCustomDropdown from './components/LomCustomDropdown';
import _ from 'lodash'
import Field from './components/FieldTaxon/components/Field/Field';
import Dropdown from './components/FieldTaxon/components/Dropdown/Dropdown';

function Lom({resourceData, standard}) {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [resource, setResource] = useState({});

  const { schema, getData, postData } = useLomSchema(standard);

  useEffect(()=> {
    requestData();
  }, [resourceData.id, standard])

  const handleChange = async (event: React.ChangeEvent<{}>, newValue: number) => {
    setLoading(true);
    await requestData();
    setValue(newValue);
  }

  const requestData = async () => {
    const res = await getData(resourceData.id);
    setResource(res.data);
    setLoading(false);
  }

  const saveTabData = async (e) => {
    await postData(resourceData.id, e)
  }

  const widgets = {
    SelectWidget: LomCustomDropdown,
    DropdownCustom: Dropdown
  };

  const tabFormData = (tab) => {
    let formData = _.find(resource, { 'key': tab.key });
    if (formData) {
      return formData.formData;
    }
  }

  const getUiSchema = (tab, schema = {}) => {
    const {properties} = tab
    schema = {...schema}
    Object.keys(properties).forEach(property => {
        if (properties[property]?.type === 'array' && tab.definitions[property]?.isUnique) {
          // is Array with a unique child
          if (!schema?.[property]) schema[property] = {}
          if (!schema[property]?.['ui:options']) schema[property]['ui:options'] = {}
          schema[property]['ui:options'] = {
            ...schema[property]['ui:options'],
            addable: false,
            removable: false,
          }
          // hide title of children array
          schema[property]['ui:title'] = ' '
        }
    })
    return schema
  }

  const uiSchema_default = { "ui:widget": "DropdownCustom" }

  return (
    <div className={classes.root}>
      <Tabs
        orientation='vertical'
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}
      >
        {
            schema.tabs.map((tab, ix) => {
                // if (tab.hide) return null;
                return (
                    <Tab key={ix} label={tab.title}  {...a11yProps(tab.key)} style={tab.hide ? {display: 'none'} : {}}/>
                )
            })
        }
      </Tabs>
      {
        schema.tabs.map((tab, ix) => {
          const uiSchema = getUiSchema(tab, uiSchema_default)
          return (
          <TabPanel value={value} index={parseInt(tab.key) - 1} key={ix}>
            <div className={loading ? classes.blur : null}></div>
            <SemanticForm
                    uiSchema={uiSchema}
                    liveOmit={false}
                    idPrefix={"rjsf_prefix"}
                    schema={tab as JSONSchema7}
                    widgets={widgets}
                    onSubmit={saveTabData}
                    formData={tabFormData(tab)}
                    noValidate
                    ArrayFieldTemplate={Field}
                  >
                    <div>
                      <Button type="submit">Submit</Button>
                    </div>
                  </ SemanticForm>
          </TabPanel>
        )})
      }
    </div>
  )
}

function a11yProps(index: any) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default Lom
