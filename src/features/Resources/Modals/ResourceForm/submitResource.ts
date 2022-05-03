import MainService from "../../../../api/service";
import { ResourceType } from "../../../../constants";

function setType(resourceType: ResourceType, files, resourceData) {

    if (resourceType !== ResourceType.MULTIMEDIA) {
        return resourceType;
    }

    if (files.length <= 0) {
        if (resourceData?.files.length <= 0) {
            return 'image';
        } else {
            return resourceData?.files[0].mime_type.split('/')[0] ?? 'image';
        }
    } else {
        return files[0].type.split('/')[0];
    }
}

export const submitResource = async (action, formData, files, previewImage, resourceType: ResourceType, resourceId: string, collectionId): Promise<Response> => {
    const data = formData;
    debugger;
    /*
    IMPORTANTE: DEFINE MEDIA TYPE ON MULTIMEDIA COLLECTION.
    En la version acutal, el tipo de multimedia se define con esta logica:
      si el user sube SOLO el preview, o SOLO crea el recurso sin preview, ni files: el recurso sera tratado como 'image'
      si el user sube 1 File (o mas), el recurso sera tratado como el mime_type del 1er file cargado en la lista de Files
    */
    let body = {
        type: setType(resourceType, files, null),
        data: JSON.stringify(data),
        collection_id: collectionId.toString()
    }

    let theFormData = new FormData();
    Object.keys(body).map((e) => {
        theFormData.append(e, body[e]);
    })

    if (files) {
        for (var i = 0; i < files.length; i++) {
            theFormData.append('File[]', files[i]);
        }
    }

    if (previewImage) {
        theFormData.append('Preview', previewImage);
    }

    const response = action === "UPDATE"
        ? MainService().updateResource(resourceId, theFormData)
        : MainService().createResource(theFormData);

    return await response;
}