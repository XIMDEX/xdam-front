import React from "react";

const DefaultFacetItems = ({ facet, fixed, isChecked, updateFacet }) => {
    
    const changeFacet = (isRadio: boolean): (event) => void => {

        const update = updateFacet(isRadio);

        return (event) => {
            const checked = event.target.checked;
            const value = event.target.value;
            
            update(value, checked);
        }
    }

    return (<>
        {Object.keys(facet.values).map((name, index) => (
            <li key={index} style={{ listStyleType: "none" }}>
                <input
                    type={facet.values[name].radio ? 'radio' : 'checkbox'}
                    name={facet.key}
                    value={fixed ? facet.values[name].id : name}
                    onChange={changeFacet(facet.values[name].radio)}
                    checked={isChecked(fixed ? facet.values.id : name, facet.key)}
                    id={(facet.key + '-' + name + '-' + facet.values[name].id).replace(/ /g, '--')}
                />
                <label htmlFor={(facet.key + '-' + name + '-' + facet.values[name].id).replace(/ /g, '--')}>
                    <span>{name} <strong>({facet.values[name].count})</strong></span>
                </label>

            </li>
        )
        )}
    </>);
}

export default DefaultFacetItems;