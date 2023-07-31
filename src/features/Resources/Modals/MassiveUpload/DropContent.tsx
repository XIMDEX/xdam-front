import React from "react";
import { Button, Message, Progress } from "semantic-ui-react";
import { BOOK } from "../../../../constants";
import BookDropContent from "./BookDropContent/BookDropContent";

const DropContent = ({
    files,
    updateFiles,
    progress,
    uploaded,
    errorOnUpload,
    resourceType,
    filesInfo,
    setFilesInfo
    }) => {

    const removeFile = (i) => {
        const updated = [...files];
        updated.splice(i, 1);

        updateFiles(updated);
    }

    return (
        <>
            {
                progress ? (
                    <>
                        <Progress success={uploaded} error={errorOnUpload} percent={progress} />
                        {
                            errorOnUpload 
                                ? <Message error> {errorOnUpload}</Message>
                                : <Message info hidden={!uploaded}> Upload done</Message>
                        }
                    </>
                ) : null
            }

            {
                files.map((file: File, i: number) => (
                    <div className='file-item' key={i}>
                        <Message success={uploaded && !errorOnUpload} error={errorOnUpload} size='small'>
                            {resourceType === BOOK
                                ? <BookDropContent file={file} filesInfo={filesInfo} setFilesInfo={setFilesInfo}> 
                                    {file.name}
                                    <Button style={uploaded || progress ? { display: 'none' } : {}} size='tiny' circular icon='close' onClick={() => removeFile(i)} />                                    
                                </BookDropContent>
                                : <div>
                                    {file.name}
                                    <Button style={uploaded || progress ? { display: 'none' } : {}} size='tiny' circular icon='close' onClick={() => removeFile(i)} />
                                </div>
                            }
                        </Message>
                    </div>
                ))
            }
        </>
    )
}

export default DropContent;