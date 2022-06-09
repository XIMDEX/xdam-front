import React, { useContext, useState } from "react";
import { Icon } from "semantic-ui-react";
import RequiredValuesContext from "../../../features/Resources/Modals/MassiveUpload/RequiredValuesContext";
import styles from './BookExtraData.module.scss';

const BookExtraData = ({ fileName, onChange }) => {

    const [collapse, setCollapse] = useState(true);
    const [link, setLink] = useState('');
    const [hover, setHover] = useState('');
    const [content, setContent] = useState('');
    const requiredValues = useContext(RequiredValuesContext);

    const changeVisibility = () => {
        setCollapse(!collapse);
    }

    const fieldEmptyAndRequired = (value) => {
        return !value && requiredValues.conversionAfterUpload;
    }

    const filedsCollapsedEmptyAndRequired = () => {
        const anyEmpty = !link || !hover || !content;

        return collapse && requiredValues.conversionAfterUpload && anyEmpty;
    }

    const changeValue = (name: string) => {
        
        return onChange(name);


        // return (event) => {
        //     event.preventDefault();

        //     onChange(name)(event.target.value);
        // }
    }
    
    const updateLink = (event) => {
        event.preventDefault()
        setLink(event.target.value);
        changeValue('Link')(event.target.value);
    }
    
    const updateHover = (event) => {
        event.preventDefault()
        setHover(event.target.value);
        changeValue('Hover')(event.target.value);
    }
    
    const updateContent = (event) => {
        event.preventDefault()
        setContent(event.target.value);
        changeValue('Content')(event.target.value);
    }

    return (
        <div className={`${styles.bookExtraData} ${filedsCollapsedEmptyAndRequired() ? styles.error : ''}`}>
            <div className={styles.bookExtraData__header} onClick={changeVisibility}>
                <Icon circular size='small' name='plus' className={collapse? styles.active : ''} />
                Extra
            </div>
            {!collapse &&
                <div className={styles.bookExtraData__body}>
                    <div className="ui form grouped fields">
                        <label htmlFor="link">Link</label>
                        <input
                            type='text' 
                            value={link} 
                            onChange={updateLink} 
                            // onBlur={changeValue('link')} 
                            className={fieldEmptyAndRequired(link) ? styles.bookExtraData__fieldError: ''} 
                        />
                    </div>

                    <div className="ui form grouped fields">
                        <label htmlFor="hover">Hover</label>
                        <input
                            type='text' 
                            value={hover} 
                            onChange={updateHover} 
                            // onBlur={changeValue('hover')}
                            className={fieldEmptyAndRequired(hover) ? styles.bookExtraData__fieldError : ''} 
                        />
                    </div>

                    <div className="ui form grouped fields">
                        <label htmlFor="content">Content</label>
                        <input
                            type='text' 
                            value={content} 
                            onChange={updateContent} 
                            // onBlur={changeValue('content')}
                            className={fieldEmptyAndRequired(content) ? styles.bookExtraData__fieldError : ''} 
                        />
                    </div>
                </div>
            }
        </div>
    )
}

export default BookExtraData;
