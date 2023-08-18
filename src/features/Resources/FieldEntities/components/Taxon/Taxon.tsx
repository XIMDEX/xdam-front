import React, { useState } from "react";
import Tag from "../Tag/Tag";
import Dropdown from "../Dropdown/Dropdown";
import { XTag } from "@ximdex/xui-react/material";

function Taxon({ data, handleData, checkIfExists, addSuggestions, items }) {
    return (
        <>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                }}
            >
                {items.map((element) => {
                    return (
                        <TaxonOrEdit
                            key={"taxon_" + element.index}
                            data={element.children}
                            popIndex={element.onDropIndexClick}
                            indexToPop={element.index}
                            array={data}
                            element={element}
                            addSuggestions={addSuggestions}
                            handleData={handleData}
                            checkIfExists={checkIfExists}
                        />
                    );
                })}
            </div>
        </>
    );
}

export default Taxon;

const TaxonOrEdit = (props) => {
    const { data, array, element } = props;
    const [xtags, setXtags] = useState(array);
    const deleteXtag = (e, key) => {
        e.preventDefault();

       /* setXtags(
            array.filter(function (obj) {
                console.log(obj.name !== key);
                return obj.name !== key;
            })
        );*/
        console.log(xtags);
    };
    return (
        <>
            {/* <Tag 
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
                    /> */}
            {xtags.map((tag) => (
                <XTag
                    key={element.key}
                    name={element.children.props.formData?.["name"]}
                    status="correct"
                    isRemovable
                    onClickRemove={(e) => deleteXtag(e)}
                />
            ))}
        </>
    );
};
