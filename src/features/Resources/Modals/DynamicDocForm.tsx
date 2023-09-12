import React, { useEffect, memo, useState } from "react";
import {
    Button,
    DialogContent,
    DialogContentText,
    ButtonGroup,
    Grid,
    Card,
} from "@material-ui/core";
import MainService from "../../../api/service";
import { MULTIMEDIA, VALIDS_LOM } from "../../../constants";
import { useSelector, useDispatch } from "react-redux";
import { selectCollection } from "../../../slices/organizationSlice";
import SemanticForm from "@rjsf/semantic-ui";
import { JSONSchema7 } from "json-schema";
import { render } from "../../../utils/render";
import { Tab, Label, Icon, Dropdown, Radio } from "semantic-ui-react";
import { Button as Btn } from "semantic-ui-react";
import { Message } from "semantic-ui-react";
import RelatedFiles from "./RelatedFiles";
import {
    setFormData,
    selectFormData,
    reloadCatalogue,
    setLomesSchema,
    setLomSchema,
} from "../../../appSlice";
import store from "../../../app/store";
import ArrayFieldTemplate from "./DynamicFormTemplates/ArrayFieldTemplate";
import ResourceActionButtons from "./ResourceActionButtons";
import { iconHandler } from "../../../utils/iconHandler";
import {
    InputText,
    InputTextArea,
    CustomToggle,
    CustomInputText,
    CustomDropdown,
} from "./DynamicFormTemplates/CustomFields";
import LomForm from "../LOM/LomForm";
import TagsFieldTemplate from "../FieldEntities/components/Field/TagsFieldTemplate";
import AiData from "../Tabs/AiData";
import useStyles from "./DynamicFormTemplates/DynamicFormStyles";
import DynamicFormTabs from "./DynamicFormTemplates/DynamicFormTabs";
import DynamicFormUi from "./DynamicFormTemplates/DynamicFormUi";
import FilesAndActions from "./DynamicFormTemplates/FileAndActions";
import { act } from "react-dom/test-utils";
import MetaDataForm from "./DynamicFormTemplates/DynamicFormMetaDataForm";

interface IBody {
    [key: string]: any;
    type: string;
    data: string;
    collection_id: string;
}
const uiSchema = DynamicFormUi;
export default function DynamicDocForm({
    resourceType,
    action,
    schema,
    dataForUpdate = null,
    handleClose,
    showLom = true,
    canImportData = true,
}) {
    let collection_id = useSelector(selectCollection);
    //let storeFormData = useSelector(selectFormData);
    const dispatch = useDispatch();
    const [previewImage, setPreviewImage] = useState(null);
    const [formFiles, setFormFiles] = useState([]);
    const [processing, setProcessing] = useState(null);
    const messageDefaultState = { display: false, text: "", ok: false };
    const [msg, setMessage] = useState(messageDefaultState);
    const _refForm = React.useRef(null);
    const [mediaType, setMediaType] = useState(dataForUpdate?.type ?? null);
    const [resourceData, setResourceData] = useState(null);
    const [theFiles, setTheFiles] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [tr, triggerReload] = useState(false);
    const [fillAlert, setFillAlert] = useState(false);

    useEffect(() => {
        if (action === "create") {
            if (typeof getStoreFormData() !== "object") {
                dispatch(setFormData({}));
                triggerReload(!tr);
            }
        } else if (action === "edit") {
            const fetchLomesSchema = async () => {
                let lomesSchema = await MainService().getLomesSchema();
                dispatch(setLomesSchema(lomesSchema));
            };

            const fecthLomSchema = async () => {
                const lomSchema = await MainService().getLomSchema();
                dispatch(setLomSchema(lomSchema));
            };

            let lomesl = localStorage.getItem("lomes_loaded");
            if (
                (lomesl === null || lomesl === "0") &&
                VALIDS_LOM.map((type) => type.key).includes("lomes")
            ) {
                fetchLomesSchema();
                localStorage.setItem("lomes_loaded", "1");
            }

            let loml = localStorage.getItem("lom_loaded");
            if (
                (loml === null || loml === "0") &&
                VALIDS_LOM.map((type) => type.key).includes("lom")
            ) {
                fecthLomSchema();
                localStorage.setItem("lom_loaded", "1");
            }

            const getResourceData = async () => {
                //* get the resource from db. Data for update is faceted data
                let res = await MainService().getResource(dataForUpdate.id);
                if (resourceType === "book" && !res.version) {
                    const version = await MainService().getBookVersion(
                        dataForUpdate.id
                    );
                    res.version = version;
                }
                setResourceData(res);
                setTheFiles(res.files);
            };
            if (!loaded) {
                getResourceData();
                dispatch(setFormData(dataForUpdate.data));
                setFillAlert(false);
                setLoaded(true);
            }

        } else if (action === "view") {
        } else {
        }
        return function cleanup() {
            //dispatch(setFormData({}));
        };
    }, [theFiles, resourceData, loaded]);

    const styleBtnPreview = {
        backgroundImage:
            "url(" +
            (previewImage
                ? URL.createObjectURL(previewImage)
                : dataForUpdate
                ? render(dataForUpdate)
                : "noimg.png") +
            ")",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
    };

    const handleFiles = (e) => {
        if (
            typeof e.target.type === "string" &&
            e.target.type === "file" &&
            e.target.name === "Preview"
        ) {
            setPreviewImage(e.target.files[0]);
            if (formFiles.length === 0 && dataForUpdate?.files.length === 0) {
                setMediaType(e.target.files[0].type.split("/")[0]);
            }
        }
        if (
            typeof e.target.type === "string" &&
            e.target.type === "file" &&
            e.target.name === "File"
        ) {
            setFormFiles(e.target.files);
            if (resourceType === MULTIMEDIA) {
                setMediaType(e.target.files[0].type.split("/")[0]);
            }
        }
    };

    function setType() {
        if (resourceType !== MULTIMEDIA) {
            return resourceType;
        }

        if (formFiles.length <= 0) {
            if (resourceData?.files.length <= 0) {
                return "image";
            } else {
                return (
                    resourceData?.files[0].mime_type.split("/")[0] ?? "image"
                );
            }
        } else {
            return formFiles[0].type.split("/")[0];
        }
    }

    const postData = async (form, event) => {
        localStorage.setItem("reload_catalogue", "1");
        setMessage(messageDefaultState);
       
        const data = form.formData;
        /*
    IMPORTANTE: DEFINE MEDIA TYPE ON MULTIMEDIA COLLECTION.
    En la version acutal, el tipo de multimedia se define con esta logica:
      si el user sube SOLO el preview, o SOLO crea el recurso sin preview, ni files: el recurso sera tratado como 'image'
      si el user sube 1 File (o mas), el recurso sera tratado como el mime_type del 1er file cargado en la lista de Files
    */

        let body: IBody = {
            type: setType(),
            data: JSON.stringify(data),
            collection_id: collection_id.toString(),
        };

        let theFormData = new FormData();
        Object.keys(body).map((e) => {
            theFormData.append(e, body[e]);
        });

        if (formFiles) {
            for (var i = 0; i < formFiles.length; i++) {
                theFormData.append("File[]", formFiles[i]);
            }
        }

        if (previewImage) {
            theFormData.append("Preview", previewImage);
        }

        let res;
        setProcessing(true);

        if (dataForUpdate) {
            res = await MainService().updateResource(
                dataForUpdate.id,
                theFormData
            );
        } else {
            res = await MainService().createResource(theFormData);
        }

        //FormFiles are the files 'adding'
        if (action !== "create") {
          //  setFormFiles([]);
        }
  //      setLoaded(false);
        setProcessing(false);
        const resData = await res.json();

        if (!res.ok) {
            setMessage({
                display: true,
                ok: res.ok,
                text: resData.error ?? "Error 0",
            });
        } else {
            console.log(resData);
         //   setForm(resData.data);
            setMessage({ display: true, text: "", ok: res.ok });
        }
        event.preventDefault();
        return false; // prevent reload
    };

    const getStoreFormData = () => {
        const fd = store.getState().app.formData;
        return fd;
    };

    const setForm = (data) => {
        dispatch(setFormData(data))
    };

    const customWidgets = {
        TextWidget: InputText,
    };

    const updateResourceFromLastCreated = async () => {
        let lastUpdated = await MainService().getLastResource(
            collection_id,
            "lastCreated"
        );
        setForm(lastUpdated.data);
        setFillAlert(true);
        triggerReload(!tr);
        // let res = await MainService().updateResourceFromLastCreated(resourceData.id);
        // setResourceData(res);
    };

    const updateResourceFromLastUpdated = async () => {
        let lastUpdated = await MainService().getLastResource(
            collection_id,
            "lastUpdated"
        );
        setForm(lastUpdated.data);
        setFillAlert(true);
        triggerReload(!tr);
        // let res = await MainService().updateResourceFromLastUpdated(resourceData.id);
        // setForm(res.data);
        // setResourceData(res);
    };

    const MainData = memo(() => {
        return (
            <Grid container style={{ height: "75vh" }}>
              <FilesAndActions
                    dataForUpdate={dataForUpdate}
                    styleBtnPreview={styleBtnPreview}
                    handleFiles={handleFiles}
                    action={action}
                    formFiles={formFiles}
                    iconHandler={iconHandler}
                />
              <MetaDataForm
                    dataForUpdate={dataForUpdate}
                    _refForm={_refForm}
                    processing={processing}
                    canImportData={canImportData}
                    updateResourceFromLastCreated={
                        updateResourceFromLastCreated
                    }
                    updateResourceFromLastUpdated={
                        updateResourceFromLastUpdated
                    }
                    msg={msg}
                    messageDefaultState={messageDefaultState}
                    handleFiles={handleFiles}
                    getStoreFormData={getStoreFormData}
                    schema={schema}
                    setForm={setForm}
                    postData={postData}
                />
            </Grid>
        );
    });

    return (
        <DialogContent className="edit-create-dialog-content">
            <DialogContentText>
                {/* Describe here how to {action} a {resourceType} */}
                <Btn
                    color="teal"
                    circular
                    icon="close"
                    onClick={() => handleClose()}
                    className="read-card-close-button"
                />
            </DialogContentText>
            <Grid container spacing={2}>
                <Grid item sm={12} id="form-content">
                    <DynamicFormTabs
                        mainData={MainData}
                        dataForUpdate={dataForUpdate}
                        action={action}
                        showLom={showLom}
                    />
                </Grid>
            </Grid>
        </DialogContent>
    );
}
