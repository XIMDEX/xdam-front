import React from 'react';
import SemanticForm from "@rjsf/semantic-ui";
import ArrayFieldTemplate from "./ArrayFieldTemplate";
import DynamicFormUi from "./DynamicFormUi";
import { JSONSchema7 } from "json-schema";
import { Button, Grid } from "@material-ui/core";
import { Button as Btn, Dropdown, Icon, Message } from "semantic-ui-react";
import { InputText } from './CustomFields';
import { MULTIMEDIA } from '../../../../constants';

const MetaDataForm = (props) => {
    const uiSchema = DynamicFormUi;

    const customWidgets = {
        TextWidget: InputText,
    };

    return (
        <Grid item sm={6}>
            <div className="forms-main-btns">
                <Btn
                    color="teal"
                    icon="facebook"
                    onClick={() => props._refForm.current.click()}
                    loading={props.processing}
                >
                    {props.dataForUpdate ? (
                        <>
                            <Icon name="save" /> Save
                        </>
                    ) : (
                        <>
                            <Icon name="save" /> Submit
                        </>
                    )}
                </Btn>

                {props.canImportData && (
                    <Dropdown
                        text="Import data"
                        icon="clone"
                        color="teal"
                        labeled
                        button
                        className="icon teal"
                    >
                        <Dropdown.Menu>
                            <Dropdown.Item
                                onClick={props.updateResourceFromLastCreated}
                            >
                                last resource created
                            </Dropdown.Item>
                            <Dropdown.Item
                                onClick={props.updateResourceFromLastUpdated}
                            >
                                last resource updated
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                )}
            </div>
            <div className="form-messages">
                <Message
                    color={props.msg.ok ? "teal" : "red"}
                    className={props.msg.display ? "zoom-message" : "hidden-message"}
                    info
                    onDismiss={() => props.setMessage(props.messageDefaultState)}
                >
                    {props.msg.ok ? (
                        <>
                            <Message.Header>Done</Message.Header>
                            <p>
                                Resource {props.dataForUpdate ? "updated" : "created"}
                            </p>
                        </>
                    ) : (
                        <>
                            <Message.Header>An error ocurred</Message.Header>
                            <p>{props.msg.text}</p>
                        </>
                    )}
                </Message>
                <Grid item sm={12}>
                    <Button variant="outlined" component="label" fullWidth>
                        Attach files
                        <input
                            type="file"
                            multiple
                            accept={
                                props.resourceType === MULTIMEDIA
                                    ? "audio/*,video/*,image/*"
                                    : "*"
                            }
                            onChange={(e) => props.handleFiles(e)}
                            name="File"
                            hidden
                        />
                    </Button>
                    {/* {resourceType === MULTIMEDIA ? (
                  <Label> You will upload a {mediaType}</Label>
              ) : null} */}
                </Grid>
            </div>
            <SemanticForm
                id="sfu"
                className={props.fillAlert ? "fill-alert" : ""}
                uiSchema={uiSchema}
                schema={props.schema as JSONSchema7}
                onSubmit={props.postData}
                formData={props.getStoreFormData()}
                onChange={(fd) => props.setForm(fd.formData)}
                ArrayFieldTemplate={ArrayFieldTemplate}
                widgets={customWidgets}
            >
                <button ref={props._refForm} type="submit" />
            </SemanticForm>
        </Grid>
    );
};

export default MetaDataForm;
