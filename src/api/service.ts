import api from './urlMapper'
import { Cookies } from 'react-cookie';
import * as ponyfill from 'web-streams-polyfill/ponyfill';
import { PATH_TAXONS_DATA, XTAGS } from '../constants';
import OrganizationsService from './OrganizationsSevice';
import CollectionsService from './CollectionsService';
import CatalogueService from './CatalogueService';
const streamSaver = require('streamsaver')

class AppService {
    /**
     * Dict containing options for using with the http client
     */
    private httpOptions = { headers: {} as any, headersForm: {}, params: {} };
    private cookies: Cookies;
    private organizationService: OrganizationsService;
    private collectionService: CollectionsService;
    private catalogueService: CatalogueService;

    constructor() 
    {
        this.cookies = new Cookies()
        this.httpOptions.headers = {
            'Content-Type': 'application/json',
            Authorization: this.getToken()
        };

        this.httpOptions.headersForm = {
          Authorization: this.getToken()
        };

      this.organizationService = new OrganizationsService(() => this.getToken());
      this.collectionService = new CollectionsService(() => this.getToken());
      this.catalogueService = new CatalogueService(() => this.getToken());

    }

    public organizations() {
      return this.organizationService;
    }

    public collections() {
      return this.collectionService;
    }

    public catalogue() {
      return this.catalogueService;
    }

    getToken()
    {
      return this.cookies.get('JWT') ? 'Bearer ' + this.cookies.get('JWT') : null
    }

    setToken(name: string, value: string, maxAge: number)
    {
      return this.cookies.set(name, value, {
        maxAge: maxAge
      });
    }

    async login (email: String, password: String): Promise<any>
    {
      const request = {
        method: api().login.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email, // Use your own property name / key
          password: password,
        }),
      }

      const url = api().login.url;

      return fetch(url, request)
        .then((response: Response) => {
          if (response.status === 401) throw new Error("Bad creadentials");
          if (response.status !== 200) throw new Error("Bad creadentials");

          return response;
        })
        .then(data => {
          return data.json();
        });
    }

    async logout()
    {
      this.cookies.remove('JWT');
      window.location.assign('/');
    }
    
    async getSchemas () 
    {
      const request = {
        method: api().getSchemas.method,
        headers: this.httpOptions.headers
      }
      const res = await (await fetch(api().getSchemas.url, request)).json();
      return res;
    }

    async _getLomesSchema () 
    {
      const request = {
        method: api().getSchemas.method,
        headers: this.httpOptions.headers
      }
      const res = await (await fetch(api().getLomesSchema.url, request)).json();
      return res;
    }
    getLomesSchema = this._getLomesSchema.bind(this)

    async _getLomSchema ()
    {
      const request = {
        method: api().getSchemas.method,
        headers: this.httpOptions.headers
      }
      const res = (await (await fetch(api().getLomSchema.url, request)).json());

      return res;
    }
    getLomSchema = this._getLomSchema.bind(this)

    async _postLomesData (resource_id, body) {
      const _api = api().postLomesData(resource_id)
      const request = {
        method: _api.method,
        headers: this.httpOptions.headers,
        body: JSON.stringify(body),
      }
      const res = await (await fetch(_api.url, request)).json();
      return res;
    }
    postLomesData = this._postLomesData.bind(this)

    async _postLomData (resource_id, body) {
      const _api = api().postLomData(resource_id)
      const request = {
        method: _api.method,
        headers: this.httpOptions.headers,
        body: JSON.stringify(body),
      }
      const res = await (await fetch(_api.url, request)).json();
      
      if (body.hasOwnProperty('Taxon Path')) {
        await this.postTaxonsData(resource_id, body['Taxon Path']);
      }
      return res;
    }
    postLomData = this._postLomData.bind(this)

    async postTaxonsData (resource_id, taxons)
    {
      const _apiXTags = api().postTags(resource_id);

      const bodyTags = {
        resourceId: resource_id,
        vocabularyId: XTAGS.vocabularyId,
        tags: []
      }

      bodyTags.tags = taxons.map(taxon => ({
        langId: XTAGS.langId,
        typeId: XTAGS.typeId,
        name: taxon['Entry'],
        definitionId: taxon['Id']
      }))

      const requestTags = {
        method: _apiXTags.method,
        headers: this.httpOptions.headers,
        body: JSON.stringify(bodyTags),
      }

      await (await fetch(_apiXTags.url, requestTags)).json();
    }

    async _getLomesData (resource_id) 
    {
      const _api = api().getLomesData(resource_id)
      const request = {
        method: _api.method,
        headers: this.httpOptions.headers,
      }
      const res = await (await fetch(_api.url, request)).json();
      return res;
    }
    getLomesData = this._getLomesData.bind(this)

    async _getLomData (resource_id) 
    {
      const _api = api().getLomData(resource_id)
      const request = {
        method: _api.method,
        headers: this.httpOptions.headers,
      }
      const res = await (await fetch(_api.url, request)).json();

      const taxones = await this.getTaxons(resource_id)
      let isAdded = res?.data?.some((tab, i) => {
        if (tab.title === "Classification") {
          res.data[i].formData['Taxon Path'] = taxones
          return true;
        }
        return false;
      })

      if (!isAdded && taxones.length > 0) {
        let key = res.data.length
        res.data[key] = {
          title: 'Classification',
          key,
          formData: {
            'Taxon Path': taxones
          }
        }
      }
        
      return res;
    }
    getLomData = this._getLomData.bind(this)

    async getTaxons (resource_id)
    {
      const _api = api().getTags(resource_id)
      const request = {
        method: _api.method,
        headers: this.httpOptions.headers,
      }
      const {tags} = await (await fetch(_api.url, request)).json();
      
      return tags.map(tag => ({
        ['Entry']: tag.label,
        ['Id']: tag.definition_id,
        taxon: tag
      }));
    }

    async _getTaxonDetails (id, vocabulary = XTAGS.vocabularyId, lang = XTAGS.lang)
    {
      const _api = api().getTaxonDetails(id, lang, vocabulary);
      const request = {
        method: _api.method,
        headers: this.httpOptions.headers,
      }
      const res = await (await fetch(_api.url, request)).json();

      return res;
    }
    getTaxonDetails = this._getTaxonDetails.bind(this)

    async getResource (resource_id) 
    {
      const _api = api().getResource(resource_id)
      const request = {
        method: _api.method,
        headers: this.httpOptions.headers,
      }
      const res = await (await fetch(_api.url, request)).json();
      return res;
    }

    async createResource (body) 
    {
      const request = {
        method: api().createResource.method,
        headers: this.httpOptions.headersForm,
        body: body
      }
      const res = await fetch(api().createResource.url, request);
      return res;
    }

    createBatchOfResources (formData) 
    {
      const _api = api().createBatchOfResources;
      const request = {
        method: _api.method,
        headers: this.httpOptions.headersForm,
        body: formData
      }
      return {_api, request};
    }

    async updateResource (id, body) {
      const _api = api().updateResource(id)
      const request = {
        method: _api.method,
        headers: this.httpOptions.headersForm,
        body: body
      }
      const res = await fetch(_api.url, request);
      return res;
    }

    async updateResourceFromLastCreated (resource_to_update) {
      const _api = api().updateResourceFromOther(resource_to_update, true, false, null)
      const request = {
        method: _api.method,
        headers: this.httpOptions.headers
      }
      const res = await (await fetch(_api.url, request)).json();
      return res;
    }

    async updateResourceFromLastUpdated (resource_to_update) {
      const _api = api().updateResourceFromOther(resource_to_update, false, true, null)
      const request = {
        method: _api.method,
        headers: this.httpOptions.headers
      }
      const res = await (await fetch(_api.url, request)).json();
      return res;
    }

    async getLastResource(collection_id, time) 
    {
      enum AVAILABLES {
        lastCreated = 'lastCreated',
        lastUpdated = 'lastUpdated'
      };
      console.log(time in AVAILABLES)
      if (!(time in AVAILABLES)) {
        throw new Error('invalid parameter: check enum AVAILABLES')
      }

      const _api = api().getLastResource(collection_id, time);
      const request = {
        method: _api.method,
        headers: this.httpOptions.headers
      }
      const res = await (await fetch(_api.url, request)).json();
      return res;
    }

    async removeResource (id) 
    {
      const _api = api().removeResource(id)
      const request = {
        method: _api.method,
        headers: this.httpOptions.headers,
      }
      const res = await fetch(_api.url, request)
      return res;
    }

    async removeMedia (dam_id, media_id) 
    {
      const _api = api().removeMedia(dam_id, media_id)
      const request = {
        method: _api.method,
        headers: this.httpOptions.headers,
      }
      const res = await(await fetch(_api.url, request)).json()
      return res;
    }
    
    async getCatalogue(id: number, query: string) 
    {
      const _api = api().getCatalog(id);
      const request = {
        method: _api.method,
        headers: this.httpOptions.headers
      }
      const res = await (await fetch(_api.url + query , request)).json();
      return res;
    }

    async setWorkspace(id: number) 
    {
      const _api = api().setWorkspace;
      const request = {
        method: _api.method,
        headers: this.httpOptions.headers,
        body: JSON.stringify({workspace_id: id}),
      }
      const res = await (await fetch(_api.url, request)).json();
      return res;
    }

    render(url: string): string
    {
      const isDamResource = this.isDamResource(url);
      const _api = api().render(url, isDamResource);
      const res = _api.url
      return res;
    }

    isDamResource(url)
    {
      return url.includes('@@@dam:@');
    }

    async downloadFile(file) 
    {
      const _api = api().downloadFile(file.dam_url);
      const request = {
        method: _api.method,
        headers: this.httpOptions.headers
      }
      const res = await fetch(_api.url, request); 
      streamSaver.WritableStream = ponyfill.WritableStream

      const blob = await res.blob();
      const newBlob = new Blob([blob]);

      const blobUrl = window.URL.createObjectURL(newBlob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `${file.file_name}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      window.URL.revokeObjectURL(blob as unknown as string);

      // const fileStream = streamSaver.createWriteStream(file.file_name);
        
      // const writer = fileStream.getWriter();

      // const reader = res.body.getReader();
      // console.log(reader);
      // const pump = () => reader.read()
      //   .then(({ value, done }) => {
      //     if (done) writer.close();
      //     else {
      //       writer.write(value);
      //       return writer.ready.then(pump);
      //     }
      //   });

      // await pump()
      //   .then(() => console.log('Closed the stream, Done writing'))
      //   .catch(err => console.log(err));
     

      return true;
    }
}

export default function MainService()
{
  return new AppService()
}
