import { Cookies } from 'react-cookie';

const api = () => {
    let cookies = new Cookies();
    let baseUrl = process.env.REACT_APP_API_BASE_URL;
    let baseUrlXTags = process.env.REACT_APP_XTAGS_API_BASE_URL; 
    let mapper = {
        baseUrl: baseUrl,
        auth: cookies.get('JWT') ? 'Bearer ' + cookies.get('JWT') : null,
        login: {    
            method: 'POST',   
            url: baseUrl + '/auth/login'
        },
        logout: {    
            method: 'POST',   
            url: baseUrl + '/user/logout'
        },
        getUser: {    
            method: 'GET',   
            url: baseUrl + '/user/me'
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
        getResourceJson: (resource_id) => ({    
            method: 'GET',   
            url: baseUrl + '/resource/json/' + resource_id + "?XDEBUG_SESSION_START"
        }),
        getCatalog: (id) => ({    
            method: 'GET',   
            url: baseUrl + '/catalogue/' + id 
        }),
        downloadFile: (dam_url) => ({    
            method: 'GET',   
            url: baseUrl + '/resource/download/' + dam_url
        }),
        render: (damUrl) => ({    
            method: 'GET',   
            url: baseUrl + '/resource/render/' + damUrl
        }),
        setWorkspace: {    
            method: 'POST',   
            url: baseUrl + '/user/workspaces/select'
        },
        createResource: {    
            method: 'POST',   
            url: baseUrl + '/resource?XDEBUG_SESSION_START=VSCODE'
        },
        createResourceSemantic: {    
            method: 'POST',   
            url: baseUrl + '/semantic/enhance?XDEBUG_SESSION_START=VSCODE'
        },
        createResourceInes: (enhanced) => ({    
            method: 'GET',   
            url: baseUrl + '/semantic/enhance/automatic' + (!enhanced ?  '?only-text=1' :'')
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
        })
    }
    return mapper;
}

export default api;