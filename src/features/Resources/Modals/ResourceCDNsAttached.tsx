import React, { useEffect, useState } from 'react';
import {
    Button,
    DialogContent,
    DialogContentText,
    ButtonGroup,
    Grid,
    Card
} from '@material-ui/core';
import { Tab, List, Label, Icon, Dropdown } from 'semantic-ui-react';
import { Button as Btn } from 'semantic-ui-react';

const CDNsAttachedToResource = ({ resourceData = null, formData = null }) => {
    const [isButtonDisabled, setDisabled] = useState(true);

    if (formData == null || !formData.hasOwnProperty('cdns_attached') || resourceData == null) {
        return (null);
    } else if (formData.cdns_attached.length > 0) {
        const selectorID = "cdn-selector-" + resourceData.id;
        const selectorInputID = selectorID + "-input";
        const selectorInputIDButton = selectorInputID + "-button";
        const selectorIDEmptyValue = -1000;

        const changeCDNSelector = (selVal) => {
        if (selVal == selectorIDEmptyValue) {
            setDisabled(true);
            (document.getElementById(selectorInputID) as HTMLInputElement).value = "";
        } else {
            formData.cdns_attached.forEach(function(element, index) {
                if (selVal == element.id) {
                    setDisabled(false);
                    var url = process.env.REACT_APP_API_BASE_URL + '/cdn/' + selVal + '/resource/';
                    (document.getElementById(selectorInputID) as HTMLInputElement).value = url + element.hash;
                }
            });
        }
        }

        const copyToClipboard = (elementID) => {
            const text = (document.getElementById(elementID) as HTMLInputElement).value;
            navigator.clipboard.writeText(text);
        }

        return (
        <div style={{marginBottom: "20px", marginRight: "5px", width: "100%"}} className={"ui form rjsf"}>
            <div className={"grouped equal width fields"}>
                <div className={"forms-textField"}>
                    <label>CDN Resource Sharing</label>
                    <div style={{display: "flex", width: "100%"}} className={"forms-textField"}>
                    <select id={selectorID} onChange={(val) => changeCDNSelector(val.target.value)}>
                        <option value={selectorIDEmptyValue} selected>{"---"}</option>
                        {formData.cdns_attached.map((item) => <option value={item.id}>{item.name}</option>)}
                    </select>
                    <input id={selectorInputID} style={{marginLeft: "3px", marginRight: "3px"}} disabled></input>
                    <Btn id={selectorInputIDButton} color='teal' icon='clone' onClick={() => copyToClipboard(selectorInputID)} disabled={isButtonDisabled}> 
                        <Icon name='clone' />
                    </Btn>
                    </div>
                </div>
            </div>
        </div>
        );
    } else {
        return (null);
    }
};

const CDNsAttachedToResourceV2 = ({ resourceData = null, formData = null }) => {
    if (formData == null || !formData.hasOwnProperty('cdns_attached') || resourceData == null) {
        return (null);
    } else if (formData.cdns_attached.length > 0) {
        const CDNItem = ({ resourceID, element }) => {
            const selectorInputID = "resource-" + resourceID + "-cdn-" + element.id + "-input";
            const selectorInputButtonID = selectorInputID + "-button";
            const cdnURL = process.env.REACT_APP_API_BASE_URL + '/cdn/' + element.id + '/resource/';
            
            const copyToClipboard = (elementID) => {
                const text = (document.getElementById(elementID) as HTMLInputElement).value;
                navigator.clipboard.writeText(text);
            }
            
            return (
            <List.Item style={{width: "100%"}}>
                <List.Content style={{width: "100%"}}>
                    <div style={{width: "100%"}} className={"ui form rjsf"}>
                        <div style={{width: "100%"}} className={"grouped equal width fields"}>
                            <div className={"forms-textField cdn-form-textfield"}>
                                <label>{element.name}</label>
                                <div style={{display: "flex", width: "100%"}}>
                                    <input id={selectorInputID} style={{marginRight: "5px"}} value={cdnURL + element.hash} disabled></input>
                                    <Btn id={selectorInputButtonID} color='teal' icon='clone' onClick={() => copyToClipboard(selectorInputID)}> 
                                        <Icon name='clone' />
                                    </Btn>
                                </div>
                            </div>
                        </div>
                    </div>
                </List.Content>
            </List.Item>
            );
        };

        return (
        <List>
            <Label>{'CDN Resource Sharing:'}</Label>
            <Card variant='outlined' className='associated-files-card'>
                {formData.cdns_attached.map((item) => (
                    <CDNItem
                        resourceID={resourceData.id}
                        element={item}
                    />
                ))}
            </Card>
        </List>
        );
    } else {
        return (null);
    }
};

export {CDNsAttachedToResource, CDNsAttachedToResourceV2};