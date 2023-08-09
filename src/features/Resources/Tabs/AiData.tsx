import React, { useEffect, useState } from "react";
import MainService from "../../../api/service";
import { useDispatch, useSelector } from "react-redux";
import { selectFormData, setFormData } from "../../../appSlice";
import { Tab } from '@material-ui/core';
import { Tabs } from '@material-ui/core';
import useStyles from "../LOM/hooks/useStyles";
import LabbelButton from "./LabbelButton"; 

const AiData = (props) => {
  const [value, setValue] = useState(0);
  const classes = useStyles();
  const dispatch = useDispatch();
  let storeFormData = useSelector(selectFormData);
  const getResourceData = async () => {
    const uuid = props.id;
    let res = await MainService().getResourceJson(uuid);
    const result = await { ...storeFormData, aiData: { ...res } };
    await dispatch(setFormData(result));
  };
  const handleChange = async (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  }
  useEffect(() => {
    if (!storeFormData.aiData) {
      getResourceData();
    }
  });
    const flexLine = {"display":"flex","padding":"0.5rem","gap":"1rem"};
    const labbel   = {"padding":"1rem","width":"100%"}

  return (
    <div>
      {storeFormData.aiData && (
        
        <div>
          {storeFormData.aiData.xtags && (
        
            <div>
              <div style={flexLine as React.CSSProperties}>
                <div>
                <Tabs
                  orientation='vertical'
                  variant="scrollable"
                  value={value}
                  onChange={handleChange}
                  aria-label="Vertical tabs example"
                  className={classes.tabs}
                  
                >
                
                  <Tab key="1" label="test"  />,
                  <Tab key="2" label="test2"  />
              
              </Tabs>
                </div>
              <div style={labbel}>
               {storeFormData.aiData.xtags_interlinked.map(xtag => <LabbelButton text="text" />)}
              </div>
           
              </div>
            
              <h3 style={{ color:"#43a1a2" }}>XTags(Unlinked)</h3>
              <div  style={flexLine as React.CSSProperties}>{storeFormData.aiData.xtags.map(xtag => <p>{xtag.name}</p>)}</div>
              <h3 style={{ color:"#43a1a2" }}>XTags</h3>
              <div  style={flexLine as React.CSSProperties}>{storeFormData.aiData.xtags_interlinked.map(xtag => <p>{xtag.name}</p>)}</div>
            </div>
          )}
          {storeFormData.aiData.imageCaptionAi && (
            <div>
              <h3 style={{ color:"#43a1a2" }}>Image</h3>
              <div  style={flexLine as React.CSSProperties}>{storeFormData.aiData.imageCaptionAi}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AiData;
