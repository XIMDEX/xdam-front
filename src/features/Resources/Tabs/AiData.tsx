import React, { useEffect } from 'react'
import MainService from '../../../api/service';
import { useDispatch, useSelector } from 'react-redux';
import { selectFormData, setAiData, setFormData } from '../../../appSlice';

const AiData = (props) => {
    const dispatch = useDispatch();
    let storeFormData = useSelector(selectFormData);
    const getResourceData = async () => {
        const uuid = props.id;
        let res = await MainService().getResourceJson(uuid);
        const result = await {...storeFormData,...res} 
        await dispatch(setFormData(result));
    }
    useEffect(() => {
      if (!storeFormData.imageCaptionAi) {
        getResourceData();
      }
    })
    
    return (
      <div>
        <p>Semantic data:</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt suscipit dignissimos ea labore ipsa illum quas temporibus cupiditate error laudantium, impedit perspiciatis modi. Rerum, cum fugiat? Optio repudiandae dignissimos vero.</p>
        {storeFormData.imageCaptionAi && <div><p>Image Data:</p>
        <p>{storeFormData.imageCaptionAi}</p></div>
        }
        
      </div>
    );
  };

  export default AiData;