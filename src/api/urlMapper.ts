import { Cookies } from 'react-cookie';
import { API_BASE_URL, BOOK_EDITOR_URL, REACT_APP_TOKEN_ALFRESCO, SOLR_ALFRESCO_URL, SOLR_DAM_URL, XTAGS_API_BASE_URL } from '../constants';

const api = () => {
    let cookies = new Cookies();
    let baseUrl = API_BASE_URL;
    let baseUrlXTags = XTAGS_API_BASE_URL;
    let mapper = {
        baseUrl: baseUrl,
        auth: cookies.get('JWT') ? 'Bearer ' + cookies.get('JWT') : null,
        login: {
            method: 'POST',
            url: baseUrl + '/auth/login'
        },
        loginToKakuma: {
            method: 'POST',
            url: baseUrl + '/auth/kakumaLogin'
        },
        logout: {
            method: 'POST',
            url: baseUrl + '/user/logout'
        },
        getUser: {
            method: 'GET',
            url: baseUrl + '/user/me?lite=true'
        },
        getSchemas: {
            method: 'GET',
            url: baseUrl + '/resourcesSchema'
        },
        getLomesSchema: {
            method: 'GET',
            url: baseUrl + '/lomesSchema'
        },
        getLomSchema: {
            method: 'GET',
            url: baseUrl + '/lomSchema'
        },
        getLomesData: (resource_id) => ({
            method: 'GET',
            url: baseUrl + '/resource/' + resource_id + '/lomes'
        }),
        getLomData: (resource_id) => ({
            method: 'GET',
            url: baseUrl + '/resource/' + resource_id + '/lom'
        }),
        getResource: (resource_id) => ({
            method: 'GET',
            url: baseUrl + '/resource/' + resource_id
        }),

        getResourceHashed: (resource_id) => ({
            method: 'GET',
            url: baseUrl + '/cdn/resource/' + resource_id
        }),
        getCatalog: (id) => ({
            method: 'GET',
            url: baseUrl + '/catalogue/' + id
        }),
        downloadFile: (dam_url) => ({
            method: 'GET',
            url: baseUrl + '/resource/download/' + dam_url
        }),
        render: (url, isDamResource = false) => ({
            method: 'GET',
            url: isDamResource ? `${baseUrl}/resource/render/${url}` : url
        }),
        setWorkspace: {
            method: 'POST',
            url: baseUrl + '/user/workspaces/select'
        },
        getWorkspaces: {
            method: 'GET',
            url: `${baseUrl}/workspace/getMultiple`
        },
        getWorkspacesOrganization: (orgID) =>  ({
            method: 'GET',
            url: `${baseUrl}/organization/${orgID}/workspaces?lite=true`
        }),
        updateWorkspace: {
            method: 'POST',
            url: `${baseUrl}/workspace/update`
        },
        createResource: {
            method: 'POST',
            url: baseUrl + '/resource'
        },
        duplicateResource: (resource_id) => ({
            method: 'GET',
            url: baseUrl + `/resource/${resource_id}/duplicate`
        }),
        duplicateStatus: (resource_id) => ({
            method: 'GET',
            url: baseUrl + `/resource/${resource_id}/clone-status`
        }),
        duplicateRetry: (resource_id) => ({
            method: 'POST',
            url: baseUrl + `/resource/${resource_id}/clone-retry`
        }),
        createBatchOfResources: {
            method: 'POST',
            url: baseUrl + '/resource/createBatch'
        },
        postLomesData: (resource_id) => ({
            method: 'POST',
            url: baseUrl + '/resource/' + resource_id + '/lomes'
        }),
        postLomData: (resource_id) => ({
            method: 'POST',
            url: baseUrl + '/resource/' + resource_id + '/lom'
        }),
        updateResource: (id) => ({
            method: 'POST',
            url: baseUrl + '/resource/' + id + '/update'
        }),
        updateWorkspaceResource: (id) => ({
            method: 'POST',
            url: baseUrl + '/resource/' + id + '/setWorkspace'
        }),
        updateResourceFromOther: (resource_to_update, last_created, last_updated, other_resource) => {
            let req = {
                method: 'POST',
                url: '',
            }
            if(last_created) {
                req.url = baseUrl + '/resource/' + resource_to_update + '/updateAsLastCreated';
                return req;
            } else if (last_updated) {
                req.url = baseUrl + '/resource/' + resource_to_update + '/updateAsLastUpdated';
                return req;
            } else {
                if(!other_resource) {
                    throw new Error('3rd parameter cannot be null. Resource id required')
                }
                req.url = baseUrl + '/resource/' + resource_to_update + '/updateAsOther/' + other_resource;
                return req;
            }
        },
        getLastResource: (collection_id, time) => ({
            method: 'GET',
            url: baseUrl + '/resource/' + time + '/' + collection_id
        }),
        getCourseEnrollments: (course_id) => ({
            method: 'GET',
            url: `${process.env.REACT_APP_KAKUMA_URL}/course/${course_id}/getEnrollments`
        }),
        removeCourseEnrollments: (course_id) => ({
            method: 'GET',
            url: `${process.env.REACT_APP_KAKUMA_URL}/course/${course_id}/removeEnrollments`
        }),
        removeResource: (id) => ({
            method: 'DELETE',
            url: baseUrl + '/resource/' + id
        }),
        removeMedia: (dam_id, media_id) => ({
            method: 'DELETE',
            url: baseUrl + '/resource/' + dam_id + '/associatedFile/' + media_id
        }),
        searchInVocabularies: (query, lang, vocabulary) => {
            let url = `${baseUrlXTags}/vocabularies/searchq=${query}`;
            url += vocabulary ? `&vocabulary=${vocabulary}` : null;
            url += lang ? `&lang=${lang}` : null;
            return {
                method: 'GET',
                url
            };
        },
        getTagInfo: (id, lang, vocabulary) => {
            let url = `${baseUrlXTags}/info?id=${id}`;
            url += vocabulary ? `&vocabulary=${vocabulary}` : null;
            url += lang ? `&lang=${lang}` : null;
            return {
                method: 'GET',
                url
            }
        },
        postTags: (resource_id) => ({
            method: 'POST',
            url: `${baseUrlXTags}/resource-tags/${resource_id}`
        }),
        getTags: (resource_id) => ({
            method: 'GET',
            url: `${baseUrlXTags}/resource-tags/${resource_id}`
        }),
        getTaxonDetails: (id, lang, vocabulary) => ({
            method: 'GET',
            url: `${baseUrlXTags}/vocabularies/info?id=${id}&vocabulary=${vocabulary}&lang=${lang}`
        }),
        getBookVersion: (bookId) => ({
            method: 'GET',
            url: `${BOOK_EDITOR_URL}api/book/${bookId}/version`
        }),
        getBookTheme: (bookId) => ({
            method: 'GET',
            url: `${BOOK_EDITOR_URL}api/book/${bookId}/theme`
        }),
        getBookThemes: () => ({
            method: 'GET',
            url: `${BOOK_EDITOR_URL}api/book/themes`
        }),
        postBookMetadata: () => ({
            method: 'POST',
            url: `${BOOK_EDITOR_URL}api/edit/metadata`
        }),
        getISMCC: (course_id) => ({
            method: 'GET',
            url: `${process.env.REACT_APP_KAKUMA_URL}/course/${course_id}/IMSCC`
        }),
        internalFederatedSearches: (params, core) => {
            let paramXimdex;
            if (Object.keys(params).length === 1 && params?.['q'] === '*:*') {
                paramXimdex = params.q;
            } else {
                paramXimdex = Object.keys(params).map(param => `${param}:${params[param]}`)
                paramXimdex = paramXimdex.join(' OR ')
            }
            if (paramXimdex && core !== 'activity') paramXimdex += '&sort=name asc'

            return {
                method: 'GET',
                url: `${SOLR_DAM_URL}/${core}/select?q=` + paramXimdex
            }
        },
        alfrescoIn2FederatedSearches: (params, core) => {
            return {
                method: 'POST',
                url: `${SOLR_ALFRESCO_URL}/alfresco/api/-default-/public/search/versions/1/search`,
                auth: 'Basic ' + REACT_APP_TOKEN_ALFRESCO,
            }
        },

        checkIfCanUpgradeScorm: (bookId) => ({
            method: 'GET',
            url: `${BOOK_EDITOR_URL}api/book/${bookId}/can_upgrade`
        }),

        upgradeScorm: (bookId) => ({
            method: 'POST',
            url: `${BOOK_EDITOR_URL}api/book/${bookId}/upgrade`
        }),

        checkAccessibility: (resource_id) => ({
            method: 'GET',
            url: `${BOOK_EDITOR_URL}api/book/${resource_id}/checkaccessibility`
        }),
    }
    return mapper;
}

export default api;
