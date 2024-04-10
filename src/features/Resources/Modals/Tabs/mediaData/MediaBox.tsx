import MainService from "../../../../../api/service"
import React from 'react';

const MediaBox = ({src}) => {
    const fileName      = MainService().render(src);
    const boxStyle = {
        maxHeight: "250px",
        margin: "auto",
        objectFit: "contain",
        padding:"4px"
      };
    const checkTypeFile = () => {
        const fileTypeMap = {
            "@@@dam:@image": "image",
            "@@@dam:@video": "video",
            "@@@dam:@audio": "audio",
            "@@@dam:@document": "document",
          };
        
          for (const [key, value] of Object.entries(fileTypeMap)) {
            if (src.includes(key)) {
              return value;
            }
          }
        
          return "";
    }
    console.log(fileName)
    return (
        <>
        {checkTypeFile() === "video" && (
          <video src={fileName} controls style={boxStyle} />
        )}
        {checkTypeFile() === "image" && (
          <img src={fileName} alt="Not Found" style={boxStyle} />
        )}
        {checkTypeFile() === "audio" && (
          <audio src={fileName} controls style={boxStyle} />
        )}
        {checkTypeFile() !== "video" && checkTypeFile() !== "audio" && (
          <p>Resource Found</p>
      )}
      </>
    )
    
}

export default MediaBox