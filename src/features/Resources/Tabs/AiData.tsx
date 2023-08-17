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

  const handleChange = async (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  }

    const flexLine = {"display":"flex","padding":"0.5rem","gap":"1rem"};
    const labbel   = {"width":"100%","border-width": "4px","display":"flex","alignItems":"center","flexDirection":"column","gap":"1rem","height":"600px","overflow":"auto"
    }

  return (
    <div>
      {storeFormData.description && (
        
        <div>
          {storeFormData.description && (
        
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
                  <Tab key="1" label="Xtags"  />,
                  <Tab key="2" label="Xtags(unlinked)"  />
                  <Tab key="3" label="Image"  />
              </Tabs>
                </div>
              <div style={labbel}>
               {value==0 &&storeFormData.description.entities_linked.map(xtag => <LabbelButton xtag={xtag} />)}
               {value==1 &&storeFormData.description.entities_non_linked.map(xtag => <LabbelButton xtag={xtag} />)}
              </div>
              </div>
            </div>
          )}
          {/*storeFormData.aiData.imageCaptionAi && (
            <div>
              <h3 style={{ color:"#43a1a2" }}>Image</h3>
              <div  style={flexLine as React.CSSProperties}>{/*storeFormData.aiData.imageCaptionAi}</div>
            </div>
          )*/}
        </div>
      )}
    </div>
  );
};

export default AiData;
