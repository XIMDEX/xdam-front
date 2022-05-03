import React from "react";
import { ResourceType } from "../../../../constants";

export enum FormAction {
    CREATE = 'CREATE',
    UPDATE = 'UPDATE'
} 

export type FormContext = {
    message: string,
    succes: boolean,
    displayMetaDataMessage: boolean,
    reload: boolean,
    fillAlert: boolean,
    processing: boolean,
    action: FormAction,
    _refForm: any,
    reloadCataloge: boolean,
    schema: any,
    previewImage: Blob | MediaSource,
    resourceType: ResourceType,
    dataForUpdate: any,
    collectionId: number,
    formMetaData: object,
    formFiles: any[],
    resourceId: string
}

export const resourceFormInitalState: FormContext = {
    message: '',
    succes: true,
    displayMetaDataMessage: false,
    reload: false,
    fillAlert: false,
    processing: false,
    action: null,
    _refForm: null,
    reloadCataloge: false,
    schema: null,
    previewImage: null,
    resourceType: null,
    formFiles: [],
    dataForUpdate: {},
    collectionId: null,
    formMetaData: {},
    resourceId: null
}

export const ResourceMetaDataForm = React.createContext<{
    state: FormContext;
    dispatch: React.Dispatch<any>;
}>({
    state: resourceFormInitalState,
    dispatch: () => null
});
