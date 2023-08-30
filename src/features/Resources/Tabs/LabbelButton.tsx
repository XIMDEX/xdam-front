import { Button } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "semantic-ui-react";
import { selectFormData, setFormData } from "../../../appSlice";
import { buttonStyle, iconTag, stylesTag, tagStyle, textStyle } from "./LabbelButtonStyle";

const LabbelButton = (props) => {
    let storeFormData = useSelector(selectFormData);
    let result = {};
    const dispatch = useDispatch();
    const sendData = () => {
        const result = { ...storeFormData };
        result.description = { ...storeFormData.description };
        result.description.semantic_tags = [...storeFormData.description.semantic_tags, props.xtag];
        
        console.log(result["description"]["semantic_tags"]);
        dispatch(setFormData(result));
    };
    //
    return (
        <div style={tagStyle as React.CSSProperties}>
            <div style={stylesTag[props.xtag.type]}>
                <Icon style={{"font-size":'24px',"color":"white"}} name={iconTag[props.xtag.type]}></Icon>
            </div>
            <div style={textStyle}><p>{props.xtag.name}</p></div>
            <Button style={buttonStyle} onClick={sendData}>
                <Icon name="share square" />
            </Button>
        </div>
    );
};
export default LabbelButton;
