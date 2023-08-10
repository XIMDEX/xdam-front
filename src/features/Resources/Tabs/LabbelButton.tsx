import { Button } from "@material-ui/core";
import { Icon } from "semantic-ui-react";

const LabbelButton = (props) => {
    const tagStyle = {
        display: "flex",
        backgroundColor: "#43a1a2",
        borderRadius: "0.75rem",
        width : "55%",
        border: "2px solid black"
    };
    const labbelStyle = {
        display: "flex",
        padding: "2rem",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#5d9dd9",
        borderRadius: "0.5rem",
        width: "20%",
    };
    const labbelStylePerson = {
        display: "flex",
        padding: "2rem",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#e42e3f",
        "border-top-left-radius": "0.75rem",
        "border-bottom-left-radius": "0.75rem",
        width: "20%",
    };
    const labbelStylePlace = {
        display: "flex",
        padding: "2rem",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#43c35b",
        "border-top-left-radius": "0.75rem",
        "border-bottom-left-radius": "0.75rem",
        width: "20%",
    };
    const labbelStyleOthers = {
        display: "flex",
        padding: "2rem",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#5c9eda",
        "border-top-left-radius": "0.75rem",
        "border-bottom-left-radius": "0.75rem",
        width: "20%",
    };
    const labbelStyleOrganization = {
        display: "flex",
        padding: "2rem",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#dabe60",
        "border-top-left-radius": "0.75rem",
        "border-bottom-left-radius": "0.75rem",
        width: "20%",
    };
    const textStyle = {
        textAlign: "center",
        backgroundColor: "#E5E7EB",
        padding: "2rem",
        justifyContent: "center",
        width: "60%",
    };
    const buttonStyle = {
        backgroundColor: "#c5c5c5",
        width: "20%",
        "border-top-right-radius": "0.75rem",
        "border-bottom-right-radius": "0.75rem",
        "font-size": "1.5rem",
        "line-height": "1.75rem",
        "display":"flex",
        "alignItems":"center",
        "justifyContent":"center"
        
      
    };
    const stylesTag = {"Person":labbelStylePerson,"Place":labbelStylePlace,"Other":labbelStyleOthers,"Organization":labbelStyleOrganization}
    const iconTag1 = {"Person":labbelStylePerson,"Place":labbelStylePlace,"Other":labbelStyleOthers,"Organization":labbelStyleOrganization}
    const iconTag = {
        Person: 'user circle',
        Place: 'map marker alternate',
        Location: 'map marker alternate',
        Other: 'tags',
        Thing: 'tags',
        Custom: 'tags',
        Corporation: 'tag',
        Institution: 'tag',
        Organisation: 'tag',
        Organization: 'tag'
      };
      
    const sendData = () => {
        console.log("sendData");
        console.log(props);
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
