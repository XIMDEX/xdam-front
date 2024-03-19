import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface CollectionState {
    current_collection: null|number,
    collections: null|Record<any, any>
}

const initialState: CollectionState  = {
  current_collection: null,
  collections: null
};

export const collectionSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    setCollections: (state, { payload } ) => {
      state.collections = payload;
    },
    setCurrentCollection: (state, { payload } ) => {
        console.log(payload)
        state.current_collection = payload;
    }
  },
});

export const { setCollections, setCurrentCollection } = collectionSlice.actions;

export const collections = (state: RootState) => state.collections.collections;
export const currentCollection = (state: RootState) => state.collections.collections.find((collection: any) => collection.id === state.collections.current_collection);
export const max_num_files_collection = (state: RootState) => {
    return state.collections.collections.find((collection: any) => collection.id === state.collections.current_collection)?.max_num_file ?? -1;
};

export default collectionSlice.reducer;
