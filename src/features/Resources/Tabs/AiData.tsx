import React, { useEffect } from 'react'
import MainService from '../../../api/service';
import { useDispatch, useSelector } from 'react-redux';
import { selectCollection } from '../../../slices/organizationSlice';
import { setAiData } from '../../../appSlice';

const AiData = (props) => {
    const dispatch = useDispatch();

    const getResourceData = async () => {
        //get the resource from db. Data for update is faceted data
        const uuid = props.id;
        let res = await MainService().getResourceJson(uuid);
        const result = await {"uuid":uuid,"data":res} 
        await dispatch(setAiData(result));
    }
    useEffect(() => {
        getResourceData();
    }, [])
    
    return (
      <div>
        <p>Semantic data:</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt suscipit dignissimos ea labore ipsa illum quas temporibus cupiditate error laudantium, impedit perspiciatis modi. Rerum, cum fugiat? Optio repudiandae dignissimos vero.</p>
        <p>Image Data:</p>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam veniam in quaerat voluptas, fugiat, nam a dicta ad quia sint, placeat recusandae obcaecati dignissimos sed architecto aperiam eius aliquid doloribus?</p>
      </div>
    );
  };

  export default AiData;