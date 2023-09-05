import React, { useEffect, useState } from "react";
import { XTag } from "@ximdex/xui-react/material";

function Taxon({ data, handleData, checkIfExists, addSuggestions, items }) {
    const [xtags, setXtags] = useState();
  //  const [data, setData] = useState(props.formData)
    const deleteXtag = (e, key) => {
        e.preventDefault();

        setXtags(
            xtags.filter(function (obj) {
                return obj.label !== key;
            })
        );
        console.log(data);
        handleData(xtags);
    };
    useEffect(() => {
      let xtagsFormat = [];
      data.map((tag,index)=>{
        let newTag = {
            id: index,
            label: tag.name,
            type: tag.type,
            link: tag.uri
        }
        xtagsFormat.push(newTag);
      })
      setXtags(xtagsFormat)
    }, [])
    
    return (
        <>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 4
                }}
            >
                {xtags && xtags.map((tag) => (
                    
                    <XTag
                        key={'v2_' + tag.id }
                        tag={tag}
                        status="correct"
                        canDelete
                        onDelete={(e) => deleteXtag(e, tag.label)}
                        lite
                    />
                ))}
            </div>
        </>
    );
}

export default Taxon;