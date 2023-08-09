const LabbelButton = (props) =>{
    const tagStyle = {"display":"flex","backgroundColor":"#43a1a2"}
    const labbelStyle = {"display":"flex","padding":"2rem","justifyContent":"center","alignItems":"center","backgroundColor":"#5d9dd9","borderRadius":"0.5rem","width":""}
    const textStyle = {"textAlign":"center","backgroundColor":"#E5E7EB","padding":"2rem","justifyContent":"center"}
    const buttonStyle = {"backgroundColor":"#fc6b6a","padding":"2rem","justifyContent":"center"}
    return(
        <div style={tagStyle as React.CSSProperties}>
            <div style={labbelStyle} >
                <p>test</p>
            </div>
            <div style={textStyle}>
                {props.text}
            </div>
            <div style={buttonStyle}>
                <p>qweeqwewq</p>
            </div>
    
        </div>
    )
}
export default LabbelButton;