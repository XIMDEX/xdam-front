import React, { useEffect, useState } from "react";
import { XTag } from "@ximdex/xui-react/material";

function Taxon({ data, handleData, checkIfExists, addSuggestions, items }) {
    const [xtags, setXtags] = useState();
    const deleteXtag = (e, key) => {
        e.preventDefault();

        setXtags(
            xtags.filter(function (obj) {
                return obj.name !== key;
            })
        );
        console.log(xtags);
    };
    useEffect(() => {
      let xtagsFormat = [];
      /*data.forEach(tag => {
        let newTag = {
            id: tag.id,
            label: tag.name,
            type: tag.type,
            link: tag.uri
        }
        xtagsFormat.push(newTag);
      });*/
      data.map((tag,index)=>{
        let newTag = {
            id: index,
            vocabulary: "Test",
            label: tag.name,
            type: tag.type,
            link: tag.uri
        }
        xtagsFormat.push(newTag);
      })
      setXtags(xtagsFormat)
      console.log(xtagsFormat)
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
                        onDelete={(e) => deleteXtag(e, tag.name)}
                        lite
                    />
                ))}
            </div>
        </>
    );
}

export default Taxon;