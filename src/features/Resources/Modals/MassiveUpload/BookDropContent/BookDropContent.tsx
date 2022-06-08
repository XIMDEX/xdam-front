import React from "react";
import BookExtraData from "../../../../../components/forms/BookExtraData/BookExtraData";
import BookNumberOfUnitSelectorWrapper from "../../../../../components/forms/BookNumberOfUnitSelectorWrapper/BookNumberOfUnitSelectorWrapper";
import ImageInputPreview from "../../../../../components/forms/ImageInputPreview/ImageInputPreview";
import styles from "./BookDropContent.module.scss";

const BookDropContent = ({ filesInfo, setFilesInfo, file, children}) => {

    const unitsTaken = (): number[] => Object.values(filesInfo).map((file: any) => file.unit);

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

    const setPreviewImageToFile = (fileName: string): (image: File) => void => {
        return (image: File) => {
            setFilesInfo({
                ...filesInfo,
                [fileName]: {
                    ...filesInfo[fileName],
                    'preview': image
                }
            })
        }
    }

    return (
        <div className={styles.bookDropContent}>
            <div className={styles.bookDropContent__previewInput}>
                <ImageInputPreview onChange={setPreviewImageToFile(file.name)} />
            </div>
            <div>
                {children}
                <div style={{ minWidth: '245px', float: 'right', paddingRight: '20px' }}>
                    <BookNumberOfUnitSelectorWrapper
                        onChange={setUnitToFile(file.name)}
                        unavaliableValues={unitsTaken()} />
                </div>
                <BookExtraData
                    fileName={file.name}
                    onChange={setExtraDataToFile(file.name)} />
            </div>
        </div>
    )
}

export default BookDropContent;