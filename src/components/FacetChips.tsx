import React, { useContext } from 'react';
import { Label } from 'semantic-ui-react'
import { ResourceQueryContex } from '../reducers/ResourceQueryReducer';

const FacetChips = () => {
    const { query } = useContext(ResourceQueryContex);
    const facetsKeys = Object.keys(query.facets);

    if (!facetsKeys) {
        return <></>;
    }

    const labels = facetsKeys
        .filter((key) => query.facets[key].length > 0)
        .map((key) => {
            const facet = query.facets[key];
            
            return (
                <span style={{margin: '0.2rem'}} key={key}>
                    <Label style={{textTransform: 'capitalize'}} >
                        {key}: {facet.join(' ')}
                    </Label>
                </span>
            )
        })

    return (<>{labels}</>);
}

export default FacetChips;