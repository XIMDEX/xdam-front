import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux';
import MainService from '../../../../api/service';
import { selectLomesSchema, selectLomSchema } from '../../../../appSlice';
import { LOM_NORMAS } from '../../../../constants';

const handleData = (e) => {
  e.formData._tab_key = e.schema.key;
  return e.formData;
}


const useLomSchema = (type) => {

  const [mainServices, setMainServices] = useState(() => {
    const { getLomesData, postLomesData, getLomData, postLomData } = MainService();

    return { getLomesData, postLomesData, getLomData, postLomData }
  });

  const METHODS = useMemo(() => ({
    [LOM_NORMAS.lom.key]: {
      select: selectLomSchema,
      getData: mainServices.getLomData,
      postData: mainServices.postLomData
    },
    [LOM_NORMAS.lomes.key]: {
      select: selectLomesSchema,
      getData: mainServices.getLomesData,
      postData: mainServices.postLomesData
    }
  }), [mainServices])

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