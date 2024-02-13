import MainService from "../../../../../api/service"
import React from 'react';

const MediaBox = ({src}) => {
    const fileName      = MainService().render(src);
    const checkTypeFile = () => {
        if(src.includes("@@@dam:@image")){
            return  "image"
        }else if(src.includes("@@@dam:@video")) {
            return "video"
        }else if(src.includes("@@@dam:@audio")) {
            return "audio"
        }else if(src.includes("@@@dam:@document")) {
            return "document"
        }
    }
    console.log(fileName)
    return (
        <>
        {checkTypeFile() === "video" && (
          <video src={fileName} controls style={{ maxHeight: "250px", margin: "auto", objectFit: "contain" }} />
        )}
        {checkTypeFile() !== "video" && (
          <img src={fileName} alt="Not Found" style={{ maxHeight: "250px", margin: "auto", objectFit: "contain" }} />
        )}
      </>
    )
    
}

export default MediaBox