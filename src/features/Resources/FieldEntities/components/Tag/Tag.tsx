import React, { useState, useEffect } from 'react'
import { Button, Icon } from 'semantic-ui-react';
import { getColorEntities, getIconName } from '../../../Modals/ViewDocumentResource';
import './Tag.css';

export default function Tag(props) {
    const [isEdit, setEdit] = useState(false);

    const handleEdition = () => setEdit(!isEdit)

    const handleDelete = props.popIndex(props.indexToPop)
    const handleEdit = (e) => {
        e.preventDefault();
        console.log('edit')
        // TODO
    }
    

    let description = null;

    if (props.uri && props.uri.includes('dbpedia')) description = 'DBpedia'
    if (props.uri && props.uri.includes('wiki')) description = 'Wikipedia' 


    return (
        <>
            <div 
                className='tag' 
                onClick={handleEdition} 
                title={`Type: ${props.type} \nEntity: ${props.label} \nPosition caractéres: ${props.pos}${props.uri ? '\nURL: ' + props.uri : ''}`}
            >
                <IconTag className='icon-tag' color={getColorEntities(props.type)} width={'32px'} type={props.type}/>
                <div className='text'>
                    <span className='label'>{props.label}</span>
                    {description && (
                        <div style={{marginTop: 3, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap'}}>
                            <a 
                                href={props.uri} 
                                target='_blank'
                                className='description'
                            >{description} 🔗 </a>
                            {/* <span style={{margin: '0 5px'}}  className='description'> • </span>
                            <span className='description'>POS: {props.pos}</span> */}
                        </div>
                    )}
                </div>
                <div style={{display: 'flex', flexDirection: 'column', height: '100%'}} onClick={(e) => e.preventDefault()}>
                    <Button id='delete'
                        icon={`${isEdit ? 'trash' : null}`} 
                        color='grey'
                        size='small'
                        className={`edit-tag ${!isEdit && 'hidden'}` }
                        onClick={isEdit ? handleDelete : null} 
                    />
                    <Button id='edit'
                        icon={`${isEdit ? 'edit' : null}`} 
                        disabled={isEdit}
                        color='grey'
                        size='small'
                        className={`edit-tag ${!isEdit && 'hidden'}` }
                        onClick={isEdit ? handleEdit : null} 
                    />

                </div>
            </div>
            {!isEdit && <div style={{width: 0}}></div>}
        </>
    )
}

function IconTag({type, width, color, ...props}) {
    
    return ( 
        <div className={` ${props.className}`} style={{backgroundColor: color}}>
            <Icon name={getIconName(type)} size='large' color='grey' inverted />
        </div> )
}
