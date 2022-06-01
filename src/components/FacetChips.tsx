import React from 'react';
import { Label } from 'semantic-ui-react'

const FacetChips = ({ facets }) => {

    if(!facets) {
        return <></>;
    }

    return (
        facets
            .filter((facet: any) => Object.values(facet.values).some((value: any) => value.selected))
            .map((facet: any) => (
                <Label >
                    {Object.values(facet.values).filter((value: any) => value.selected)[0] ?? facet.key}
                </Label>
            )
        )
    )
}

// Object.keys(data).map(key => (
//   data[key].map((value, ix) => (
//     <Label >
//       {key === WORKPSACES ? (value) : (value === 'true' || value === 'false' ? key + ': ' + value : value)}
//     </Label>
//   ))
// ))


export default FacetChips;