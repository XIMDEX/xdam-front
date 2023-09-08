import React, { useEffect, useState } from "react";
import MainService from "../../../api/service";
import { useDispatch, useSelector } from "react-redux";
import { selectFormData, setFormData } from "../../../appSlice";
import { Tab } from "@material-ui/core";
import { Tabs } from "@material-ui/core";
import useStyles from "../LOM/hooks/useStyles";
import LabbelButton from "./LabbelButton";
import AddButton from "./AddButton";

const AiData = (props) => {
    const [value, setValue] = useState(0);
    const classes = useStyles();
    let storeFormData = useSelector(selectFormData);
    const [Xtags, setXtags] = useState();
    const [XtagUnliked, setXtagUnliked] = useState();
    const [imageCaptionAi, setImageCaptionAi] = useState();
    useEffect(() => {
        if (
            storeFormData.description &&
            storeFormData.description.entities_linked
        ) {
            setXtags(
                storeFormData?.description?.entities_linked.filter(
                    (obj) => obj.uuid === props.uuid
                )
            );
        }
        if (
            storeFormData.description &&
            storeFormData.description.entities_non_linked
        ) {
            setXtagUnliked(
                storeFormData?.description?.entities_non_linked.filter(
                    (obj) => obj.uuid === props.uuid
                )
            );
        }
        if (storeFormData.description.imageCaptionAi) {
            setImageCaptionAi(storeFormData.description.imageCaptionAi);
        }
    }, [props.uuid]);

    const handleChange = async (
        event: React.ChangeEvent<{}>,
        newValue: number
    ) => {
        setValue(newValue);
    };

    const flexLine = { display: "flex", padding: "0.5rem", gap: "1rem" };
    const labbel = {
        width: "100%",
        "border-width": "4px",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        gap: "1rem",
        height: "600px",
        overflow: "auto",
    };

    return (
        <div>
            {storeFormData.description && (
                <div>
                    <div>
                        <div style={flexLine as React.CSSProperties}>
                            <div>
                                <Tabs
                                    orientation="vertical"
                                    variant="scrollable"
                                    value={value}
                                    onChange={handleChange}
                                    aria-label="Vertical tabs example"
                                    className={classes.tabs}
                                >
                                    <Tab key="1" label="Xtags" />,
                                    <Tab key="2" label="Xtags(unlinked)" />
                                    <Tab key="3" label="Image" />
                                </Tabs>
                            </div>
                            <div style={labbel}>
                                {Xtags &&
                                    value == 0 &&
                                    Xtags.map((xtag) => (
                                        <LabbelButton xtag={xtag} />
                                    ))}
                                {XtagUnliked &&
                                    value == 1 &&
                                    XtagUnliked.map((xtag) => (
                                        <LabbelButton xtag={xtag} />
                                    ))}
                                {value == 2 && (<AddButton text={imageCaptionAi}/>)}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AiData;
