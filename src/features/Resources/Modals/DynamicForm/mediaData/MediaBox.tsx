import MainService from "../../../../../api/service"
import React from 'react';

const MediaBox = ({src}) => {
    const fileName      = MainService().render(src);
    //const fileExtension = fileName.substring(fileName.lastIndexOf(".") + 1);
    console.log(fileName)
    return (
        <img src={fileName} alt="Not Found" style={{"maxHeight":"250px","margin":"auto","objectFit":"contain"}} />
    )
    
}

export default MediaBox