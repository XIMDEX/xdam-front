import React, { useState } from "react";
import { Icon } from "semantic-ui-react";
import styles from './BookExtraData.module.scss';

const BookExtraData = ({ fileName, onChange }) => {

    const [collapse, setCollapse] = useState(true);
    const [link, setLink] = useState('');
    const [hover, setHover] = useState('');
    const [content, setContent] = useState('');

    const changeVisibility = () => {
        setCollapse(!collapse);
    }

    const changeValue = (name: string) => {
        return (event) => {
            event.preventDefault();

            onChange(name)(event.target.value);
        }
    }
    
    const updateLink = (event) => {
        event.preventDefault()
        setLink(event.target.value);
    }
    
    const updateHover = (event) => {
        event.preventDefault()
        setHover(event.target.value);
    }
    
    const updateContent = (event) => {
        event.preventDefault()
        setContent(event.target.value);
    }

    return (
        <div className={styles.bookExtraData}>
            <div className={styles.bookExtraData__header} onClick={changeVisibility}>
                <Icon circular size='small' name='plus' className={collapse? styles.active : ''} />
                Extra
            </div>
            {!collapse &&
                <div className={styles.bookExtraData__body}>
                    <div className="ui form grouped fields">
                        <label htmlFor="link">Link</label>
                        <input id={`${fileName}_link`} type='text' value={link} onChange={updateLink} onBlur={changeValue('link')} />
                    </div>

                    <div className="ui form grouped fields">
                        <label htmlFor="hover">Hover</label>
                        <input id={`${fileName}_hover`} type='text' value={hover} onChange={updateHover} onBlur={changeValue('hover')} />
                    </div>

                    <div className="ui form grouped fields">
                        <label htmlFor="content">Content</label>
                        <input id={`${fileName}_content`} type='text' value={content} onChange={updateContent} onBlur={changeValue('content')} />
                    </div>
                </div>
            }
        </div>
    )
}

export default BookExtraData;
