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
        width: "30%",
    };
    const textStyle = {
        textAlign: "center",
        backgroundColor: "#E5E7EB",
        padding: "2rem",
        justifyContent: "center",
        width: "50%",
    };
    const buttonStyle = {
        backgroundColor: "#c5c5c5",
        padding: "2rem",
        justifyContent: "center",
        width: "20%",
        "border-top-right-radius": "0.75rem",
        "border-bottom-right-radius": "0.75rem"
    };
    //good gray for background hexadecimal?
    const sendData = () => {
        console.log("sendData");
    };
    return (
        <div style={tagStyle as React.CSSProperties}>
            <div style={labbelStyle}>
                <p>test</p>
            </div>
            <div style={textStyle}>{props.text}</div>
            <div style={buttonStyle} onClick={sendData}>
                <Icon name="share square" />
            </div>
        </div>
    );
};
export default LabbelButton;
