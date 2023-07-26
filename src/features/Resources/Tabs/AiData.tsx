import React, { useEffect } from "react";
import MainService from "../../../api/service";
import { useDispatch, useSelector } from "react-redux";
import { selectFormData, setAiData, setFormData } from "../../../appSlice";

const AiData = (props) => {
  const dispatch = useDispatch();
  let storeFormData = useSelector(selectFormData);
  const getResourceData = async () => {
    const uuid = props.id;
    let res = await MainService().getResourceJson(uuid);
    const result = await { ...storeFormData, aiData: { ...res } };
    await dispatch(setFormData(result));
  };
  useEffect(() => {
    if (!storeFormData.aiData) {
      getResourceData();
    }
  });
  const flexLine = {"display":"flex","padding":"0.5rem","flexDirection":"row","flexWrap":"wrap","gap":"1rem"};
  
  return (
    <div>
      {storeFormData.aiData && (
        <div>
          {storeFormData.aiData.xtags && (
            <div>
              <h3 style={{ color:"#43a1a2" }}>XTags(Unlinked)</h3>
              <div  style={flexLine}>{storeFormData.aiData.xtags.map(xtag => <p>{xtag.name}</p>)}</div>
              <h3 style={{ color:"#43a1a2" }}>XTags</h3>
              <div  style={flexLine}>{storeFormData.aiData.xtags_interlinked.map(xtag => <p>{xtag.name}</p>)}</div>
            </div>
          )}
          {storeFormData.aiData.imageCaptionAi && (
            <div>
              <h3 style={{ color:"#43a1a2" }}>Image</h3>
              <div  style={flexLine}>{storeFormData.aiData.imageCaptionAi}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AiData;
