import React from 'react'
import Tag from '../Tag/Tag'
import Dropdown from '../Dropdown/Dropdown';

function Taxon({data,handleData, checkIfExists, addSuggestions, items}) {
    return (
        <> 
            <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
                {items.map(element => {
                    return ( 
                        <TaxonOrEdit 
                            key={'taxon_' + element.index}
                            data={element.children} 
                            popIndex={element.onDropIndexClick} 
                            indexToPop={element.index} 
                            array={data}
                            element={element}
                            addSuggestions={addSuggestions}
                            handleData={handleData}
                            checkIfExists={checkIfExists}
                        />
                    )
                })}
            </div>
         </>
    )
}

export default Taxon


const TaxonOrEdit = (props) => {
    const {data, array, element} = props
    return (
        <>
            {array.some( item => item['Id'] === data.props.formData['Id'] || item.new)
                ? (
                    <Tag 
                        key={element.key} 
                        label={element.children.props.formData?.['name']} 
                        uri={element.children.props.formData?.['uri']}
                        type={element.children.props.formData.type}
                        pos={`${element.children.props.formData.start}-${element.children.props.formData.end}`}
                        index={element.index}
                        data={element.children} 
                        popIndex={element.onDropIndexClick} 
                        indexToPop={element.index} 
                        array={data}
                        addSuggestions={props.addSuggestions}
                    /> 
                ) : (
                    <Dropdown
                        {...props}
                        element={element}
                        handleData={props.handleData}
                        handleIfExists={props.checkIfExists}
                        popIndex={element.onDropIndexClick} 
                        indexToPop={element.index} 
                    />
                )
            }
        </>
    )
}
             