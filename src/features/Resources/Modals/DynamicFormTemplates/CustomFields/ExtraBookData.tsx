import React, { useState } from "react"
import { Segment } from 'semantic-ui-react'

export const ExtraBookData = (props) => {
    const [data, setData] = useState({...props.formData});

    const onChange = (name) => {
        return (event) => {
            event.preventDefault();

            const nextData = {
                ...data,
                [name]: event.target.value
            }

            setData(nextData);

            props.onChange(nextData);
        };
    }

    return (
        <Segment className='forms-textField'>
            <section>
                <h3>Extra</h3>
                <div className="ui form grouped fields">
                    <label htmlFor="link">Link</label>
                    <input id={`extra_link`} type='text' value={data.link} onChange={onChange('link')} />
                </div>

                <div className="ui form grouped fields">
                    <label htmlFor="hover">Hover</label>
                    <input id={`extra_hover`} type='text' value={data.hover} onChange={onChange('hover')} />
                </div>
                
                <div className="ui form grouped fields">
                    <label htmlFor="content">Content</label>
                    <input id={`extra_content`} type='text' value={data.content} onChange={onChange('content')} />
                </div>
            </section>
        </Segment>
    )
}