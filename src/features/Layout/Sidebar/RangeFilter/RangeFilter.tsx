import { Slider } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setResourcesLoading } from '../../../../appSlice';
import { selectFacetsQuery, selectQuery, setFacetsQuery, setQuery } from '../../../../slices/organizationSlice';


export default function RangeFilter( {values, fkey} ) { 
    const [value, setValue] = useState<number[]>([0, 1]);
    const [valuesSet, isValueSet] = useState<Boolean>(false);
    const [min, setMin] = useState<number>(0);
    const [max, setMax] = useState<number>(1);
    const currentQuery = useSelector(selectFacetsQuery);
    const currentFacets = JSON.parse(JSON.stringify(currentQuery));
    const cQuery = useSelector(selectQuery);
    const dispatch = useDispatch()

    useEffect(()=>{
        Object.keys(values).map((val, i) => {
            if (i === 0) setMin(parseInt(val));
            if (! values[i+1]) setMax(parseInt(val));
        });
        if(!valuesSet) {
            setValue([min, max]);
            isValueSet(true);
        }
        
    }, [value]);

    const handleChange = (event: any, newValue: number | number[]) => {
        //console.log(newValue)
        setValue(newValue as number[]);
    };

    const makeRequest = () => {
        
        if (currentFacets.hasOwnProperty(fkey)) {
            currentFacets[fkey].splice(fkey, 1, fkey)
        } else {
            currentFacets[fkey] = []
            currentFacets[fkey].push(min)
            currentFacets[fkey].push(max)
        }
        let nQ = {
            ...cQuery
        };
        nQ.page = 1
        dispatch(setResourcesLoading(true))
        dispatch(setQuery(nQ));
        dispatch(setFacetsQuery(currentFacets))
        console.log('send', value)
    };

    function valuetext(value: number) {
        return `${value}°C`;
    }
  
    return (
      <div>
        <Slider
          value={value}
          onChange={handleChange}
          onChangeCommitted={makeRequest}
          valueLabelDisplay="auto"
          aria-labelledby="range-slider"
          getAriaValueText={valuetext}
          min={min}
          max={max}
        />
      </div>
    );
}

