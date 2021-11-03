import React from 'react'
import { useSelector } from 'react-redux';
import MainService from '../../../../api/service';
import { selectLomesSchema, selectLomSchema } from '../../../../appSlice';
import { LOM_NORMAS } from '../../../../constants';

const { 
  getLomesData, 
  postLomesData, 
  getLomData, 
  postLomData 
} = MainService();

const handleData = (e) => {
  e.formData._tab_key = e.schema.key;
  return e.formData;
}


const METHODS = {
  [LOM_NORMAS.LOM]: {
    select: selectLomSchema,
    getData: getLomData,
    postData: postLomData
  },
  [LOM_NORMAS.LOMES]: {
    select: selectLomesSchema,
    getData: getLomesData,
    postData: postLomesData
  }
}

const useLomSchema = (type) => {

  const schema = useSelector(METHODS[type].select);
  const handleGetData = async (id) => await METHODS[type].getData(id);
  const handlePostData = async (id, data) => await METHODS[type].postData(id, handleData(data)) 
  
  return {
    schema,
    getData: handleGetData,
    postData: handlePostData 
  }
}

export default useLomSchema