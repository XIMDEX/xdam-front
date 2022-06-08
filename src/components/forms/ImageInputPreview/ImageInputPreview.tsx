import React, { useState } from "react";
import { Button } from "semantic-ui-react";
import styles from './ImageInputPreview.module.scss';

const ImageInputPreview = ({ onChange }) => {

    const [previewImage, setPreviewImage] = useState(null);
    const hiddenFileInput = React.useRef(null);

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
        <Button
            className={styles.imageInputPreview}
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
    )
}

export default ImageInputPreview;