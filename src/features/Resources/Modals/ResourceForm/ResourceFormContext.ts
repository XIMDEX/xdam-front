import React from "react";
import { ResourceType } from "../../../../constants";

export enum FormAction {
    CREATE = 'CREATE',
    UPDATE = 'UPDATE'
} 

export type ResourceFormState = {
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
    files: any[],
    resourceId: string,
    resource: any,
    formMetaDataFilled: boolean
}

export const resourceFormInitalState: ResourceFormState = {
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
    files: [],
    dataForUpdate: {},
    collectionId: null,
    formMetaData: {},
    resourceId: null,
    resource: null,
    formMetaDataFilled: false
}

export const ResourceFormContex = React.createContext<{
    state: ResourceFormState;
    dispatch: React.Dispatch<any>;
}>({
    state: resourceFormInitalState,
    dispatch: () => null
});
