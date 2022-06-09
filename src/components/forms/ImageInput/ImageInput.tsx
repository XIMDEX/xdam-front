import React, { useContext, useState } from "react";
import { Button } from "semantic-ui-react";
import RequiredValuesContext from "../../../features/Resources/Modals/MassiveUpload/RequiredValuesContext";
import styles from './ImageInput.module.scss';

const ImageInput = ({ onChange }) => {

    const [previewImage, setPreviewImage] = useState(null);
    const hiddenFileInput = React.useRef(null);
    const requiredValues = useContext(RequiredValuesContext);

    const noFileAndRequired = () => {
        return requiredValues.conversionAfterUpload && !previewImage
    }

    const handleClick = () => {
        hiddenFileInput.current.click();
    };

    const previewBackground = () => {

        const url = previewImage ? URL.createObjectURL(previewImage) : 'noimg.png';

        return {
            backgroundImage: `url(${url})`,
        }
    }

    const handleFiles = (e) => {
        const image = e.target.files[0];
        if(previewImage && !image) {
            return;
        }

        setPreviewImage(image);
        onChange(image);
    }
    
    return (
        <div className={`${styles.imageInputPreview} ${noFileAndRequired() ? styles.error : ''}`}>
            <Button
                className={styles.imageInputPreview__button}
                onClick={handleClick}
                style={previewBackground()}
                component="label"
                fullWidth
                variant='outlined'
            >
                <input
                    accept="image/*"
                    type="file"
                    ref={hiddenFileInput}
                    onChange={(e) => handleFiles(e)}
                    name='Preview'
                    hidden
                />
            </Button>
        </div>
    )
}

export default ImageInput;