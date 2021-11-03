import React, { useState, useContext, useEffect } from 'react'
import Tag from '../Tag/Tag'
import Dropdown from '../Dropdown/Dropdown';

function Taxon(props) {
    const [data, setData] = useState(props.formData)

    const handleData = value => {
        setData([...data, value])
    }

    return (
        <> 
            <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
                {props.items.map((element, i) => {
                    return ( 
                        <TaxonOrDropDown 
                            data={element.children} 
                            popIndex={element.onDropIndexClick} 
                            indexToPop={element.index} 
                            array={data}
                            element={element}
                            addSuggestions={props.addSuggestions}
                            handleData={handleData}
                        />
                    )
                })}
            </div>
         </>
    )
}

export default Taxon


const TaxonOrDropDown = (props) => {
    const {data, array, element} = props

    return (
        <>
            {array.some( item => item['Id'] === data.props.formData['Id'] || item.new)
                ? (
                    <Tag 
                        key={element.key} 
                        label={element.children.props.formData?.['Entry']} 
                        id={element.children.props.formData?.['Id']} 
                        index={element.index}
                        data={element.children} 
                        popIndex={element.onDropIndexClick} 
                        indexToPop={element.index} 
                        array={data}
                        addSuggestions={props.addSuggestions}
                    /> 
                ) : (
                    <Dropdown {...props} element={element} handleData={props.handleData}/>
                )
            }
        </>
    )
}
             