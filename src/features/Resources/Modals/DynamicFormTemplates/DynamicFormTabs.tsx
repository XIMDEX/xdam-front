import React from "react";

import { Tab } from "semantic-ui-react";
import { VALIDS_LOM } from "../../../../constants";
import LomForm from "../../LOM/LomForm";
import { Grid } from "@material-ui/core";
import AiData from "../../Tabs/AiData";
import store from "../../../../app/store";
import "./tab.css";

const DynamicFormTabs = (props) => {
   
    const metaData = {
        menuItem: "Main Data",
        render: () => <Tab.Pane> {<props.mainData />}</Tab.Pane>,
    };
    const lomsData = !props.showLom
        ? []
        : VALIDS_LOM.map((typeLom) => ({
              menuItem: typeLom.name,
              render: () => (
                  <Tab.Pane>
                      <LomForm
                          data={props.dataForUpdate}
                          standard={typeLom.key}
                      />
                  </Tab.Pane>
              ),
          }));
    const pane = [metaData];
    const storeTags = store.getState().app.formData;
    const panes = () => {
        if (
            storeTags.description !== null &&
            typeof storeTags.description !== "undefined"
        ) {
            const entities = storeTags.description.entities_linked ?? "";
            const uuids = [];
            const uuidsTabs = [];
            entities.forEach((element) => {
                if (uuids.indexOf(element.uuid) === -1) {
                    uuids.push(element.uuid);
                }
            });
            uuids.forEach((element,index) => {
                uuidsTabs.push({
                    menuItem: `File${index+1}`,
                    render: () => (
                       
                            <Tab.Pane>
                                <AiData uuid={element} />
                            </Tab.Pane>
                       
                    ),
                });
            });
            return [
                metaData,
                ...uuidsTabs,
            ];
        }
    };

    return (
        <Grid item sm={12} id="form-content ">
            {storeTags &&
            props.dataForUpdate &&
            props.action === "edit" &&
            panes ? (
                <div>
                    <Tab panes={panes()} />
                </div>
            ) : (
                <Tab panes={pane} />
            )}
        </Grid>
    );
};

export default DynamicFormTabs;
