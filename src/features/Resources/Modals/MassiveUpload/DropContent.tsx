import React from "react";
import { Button, Message, Progress } from "semantic-ui-react";
import BookExtraData from "../../../../components/forms/BookExtraData/BookExtraData";
import BookNumberOfUnitSelectorWrapper from "../../../../components/forms/BookNumberOfUnitSelectorWrapper/BookNumberOfUnitSelectorWrapper";
import { BOOK } from "../../../../constants";

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

    const setUnitToFile = (fileName: string): (unit: number) => void => {
        
        return (unit: number) => {
            setFilesInfo({
                ...filesInfo,
                [fileName]: {
                    ...filesInfo[fileName],
                    'unit': unit
                }
            });

        }
    }

    const setExtraDataToFile = (fileName: string): (name: string) => (value) => void => {

        return (name: string) => {
            return (value) => {
                setFilesInfo({
                    ...filesInfo,
                    [fileName]: {
                        ...filesInfo[fileName] || {},
                        'extra': {
                            ...filesInfo[fileName]?.extra || {},
                            [name]: value
                        }
                    }
                })
            };
        }
    }

    const unitsTaken = (): number[] => Object.values(filesInfo).map((file: any) => file.unit);

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
                            <div>
                                {file.name}
                                <Button style={uploaded || progress ? { display: 'none' } : {}} size='tiny' circular icon='close' onClick={() => removeFile(i)} />
                                {resourceType === BOOK &&
                                    <div style={{ minWidth: '245px', float: 'right', paddingRight: '20px' }}>
                                        <BookNumberOfUnitSelectorWrapper
                                            onChange={setUnitToFile(file.name)}
                                            unavaliableValues={unitsTaken()}
                                        />
                                    </div>
                                }
                            </div>
                            <BookExtraData
                                fileName={file.name}
                                onChange={setExtraDataToFile(file.name)}
                            />
                        </Message>
                    </div>
                ))
            }
        </>
    )
}

export default DropContent;