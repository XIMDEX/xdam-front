import React from 'react'
import { Dropdown } from 'semantic-ui-react';


function LomCustomDropDown(props) {
  const opts = props?.schema?.enum?.map?.((val, index) => ({
    key: index,
    text: val,
    value: val
  }));

  const handleChange = (e:any, {value}) => props.onChange(value?.toString())
  
  return (
    <>
      <label>{props.label}</label>
      <Dropdown
        placeholder='Seleccionar'
        fluid
        selection
        options={opts}
        selectOnBlur={false}
        onChange={handleChange}
        value={props.value}
      />
    </>
  )
}

export default LomCustomDropDown
