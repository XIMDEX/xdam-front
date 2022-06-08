import React, { useState } from "react";
import { Icon } from "semantic-ui-react";
import styles from './BookExtraData.module.scss';

const BookExtraData = ({ values, fileName, onChange }) => {

    const [collapse, setCollapse] = useState(false);
    const [link, setLink] = useState(values?.link || '');
    const [hover, setHover] = useState(values?.hover || '');
    const [content, setContent] = useState(values?.content || '');

    const changeVisibility = () => {
        setCollapse(!collapse);
    }

    const updateLink = (e) => setLink(e.target.value);
    const updateHover = (e) => setHover(e.target.value);
    const updateContent = (e) => setContent(e.target.value);

    return (
        <div className={styles.bookExtraData}>
            <div className={styles.bookExtraData__header} onClick={changeVisibility}>
                <Icon circular name='plus' className={collapse? styles.active : ''} />
                Extra
            </div>
            {!collapse &&
                <div className={styles.bookExtraData__body}>
                    <div className="ui form grouped fields">
                        <label htmlFor="link">Link</label>
                        <input id={`${fileName}_link`} type='text' value={link} onChange={updateLink} onBlur={onChange('link')} />
                    </div>

                    <div className="ui form grouped fields">
                        <label htmlFor="hover">Hover</label>
                        <input id={`${fileName}_hover`} type='text' value={hover} onChange={updateHover} onBlur={onChange('hover')} />
                    </div>

                    <div className="ui form grouped fields">
                        <label htmlFor="content">Content</label>
                        <input id={`${fileName}_content`} type='text' value={content} onChange={updateContent} onBlur={onChange('content')} />
                    </div>
                </div>
            }
        </div>
    )
}

export default BookExtraData;
