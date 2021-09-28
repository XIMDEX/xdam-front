import { Tabs } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import TabPanel from './components/TabPanel/TabPanel';
import useLomSchema from './hooks/useLomSchema';
import useStyles from './hooks/useStyles'
import SemanticForm from "@rjsf/semantic-ui";
import { JSONSchema7 } from 'json-schema';
import { Button } from 'semantic-ui-react';
import { Tab } from '@material-ui/core';
import LomCustomDropdown from './components/LomCustomDropdown';
import _ from 'lodash'

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
    SelectWidget: LomCustomDropdown
  };

  const tabFormData = (tab) => {
    let formData = _.find(resource, { 'key': tab.key });
    if (formData) {
      return formData.formData;
    }
  }

  return (
    <div className={classes.root} key='paco'>
      <Tabs
        orientation='vertical'
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}
      >
        {
          schema.tabs.map((tab, ix) => (
            <Tab key={ix} label={tab.title} {...a11yProps(tab.key)} />
          ))
        }
      </Tabs>
      {
        schema.tabs.map((tab, ix) => (
          <TabPanel value={value} index={parseInt(tab.key) - 1} key={ix}>
            <div className={loading ? classes.blur : null}></div>
            <SemanticForm
                    liveOmit={false}
                    idPrefix={"rjsf_prefix"}
                    schema={tab as JSONSchema7}
                    widgets={widgets}
                    onSubmit={saveTabData}
                    formData={tabFormData(tab)}
                    noValidate
                  > 
                    <div>
                      <Button type="submit">Submit</Button>
                    </div>
                  </ SemanticForm>
          </TabPanel>
        ))
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
