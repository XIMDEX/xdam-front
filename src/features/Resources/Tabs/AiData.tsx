import React, { useEffect } from 'react'
import MainService from '../../../api/service';
import { useSelector } from 'react-redux';
import { selectCollection } from '../../../slices/organizationSlice';
import { selectFormData } from '../../../appSlice';
const AiData = (props) => {
    let storeFormData = useSelector(selectFormData);
    console.log("Entro")
    console.log(storeFormData)
    const getResourceData = async () => {
        //get the resource from db. Data for update is faceted data
        let res = await MainService().getResourceJson(props.id);

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