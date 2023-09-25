const FileBar = (props) => {
    const barStyle = {"display":"flex","justifyContent":"space-around","width":"80%"}
    return(
        <div style={barStyle}>
            <p style={ {"font-weight": "bold"}}>Name: {props.file.file_name}</p>
            <p>Mime type: {props.file.mime_type}</p>
            <p>Remove</p>
        </div>
    )
};

export default FileBar;