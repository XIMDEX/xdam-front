import { ALFRESCO_SITE, SOLR_ALFRESCO_URL, bookLanguages } from "../constants"
import { COMMON_FILTERS, CORE_FILTERS } from "../features/Search/constants"
import { render } from "./render"

export enum ContentTypes {
    'Fotografía',
    'Ilustración',
    'Vídeo',
    'Audio',
    'Animación',
    'Locución',
    'Infografía',
    'Documento',
    'Actividad',
    'Presentación',
    'Cuestionario',
    'Base de datos',
    'Programaciones',
    'Solucionarios',
    'Paquete SCORM',
    'Directorio'
}

type ResourceType = {
    type: 'internal'|'external'
    ID: String, // UUID
    core: 'book'|'multimedia'|'activity'|'assessment',
    name:  String,
    description?: String,
    img?: String,
    language: 'es_ES'|'en_EN'|'cat_ES'|'ca_ES'|'eu_ES'|'gl_ES',
    status: Boolean,
    resource_type: ContentTypes,
    receiver?: 'Alumno'|'Profesor'|'General',
    cognitive_process?:'Nivel 1: Recordar'|'Nivel 2: Comprender'|'Nivel 3: Aplicar'|'Nivel 4: Analizar'|'Nivel 5: Evaluar'|'Nivel 6: Crear',
    copyright?: 'Propietaria MHE'|'Creative Comnmons'|'De terceros'|'Licencia GFDL'|'Dominio público',
    accessibility?: 'Nivel de accesibilidad AA'|'Nivel de accesibilidad AAA'|'Cumplimiento de la norma WCAG 2.1'|'Cumplimiento de la norma WCAG 2.2',
    level?: String,
    skill?: String,
    discipline?: String,
    type_file?: String,
    activity_type?: 'correspondence'|'fill-the-blanks'|'fit-word'|'input'|'input-long'|'match'|'multiple-choice'|'order-chronology'|'rank'|'seek-and-find'|'single-choice'|'true-false'|'word-catcher'|'word-search',
    multimedia_type?: 'audio'|'video'|'image',
    unit?: String,
    units?: Array<String>,
    isbn?: Array<String>,
    languages_allowed?: Array<'es_ES'|'en_EN'|'cat_ES'|'ca_ES'|'eu_ES'|'gl_ES'>
    created_at: Date,
    updated_at: Date,
    project_type?: String,
    link?: String
}

const DICT_ALFRESCO = {
    rt: 'macgh:tipo_recurso',
    r: 'macgh:destinatario',
    cp: 'macgh:proceso_cognitivo',
    cpr: 'macgh:derechos_autor',
    acc: 'macgh:accesibilidad',
    l: 'macgh:idioma',
    s: 'macgh:estado_documento',
    mt: 'macgh:tipo_media',
    description: 'cm:description',
    project_type: 'macgh:tipo_proyecto',
    id: 'macgh:id',
    created_at: 'createdAt',
    updated_at: 'modifiedAt',
    name: 'cm:name',
    year: 'macgh:anyo',
    isbn_digital: 'macgh:isbn_digital',
    isbn: 'macgh:isbn',
    ft: 'content.mimetype',
}


const DICT_XIMDEX = {
    rt: 'tipo_recurso',
    r: 'destinatario',
    cp: 'proceso_cognitivo',
    cpr: 'derechos_autor',
    acc: 'accesibilidad',
    l: 'language',
    la: 'available_languages',
    ld: 'language_default',
    s: 'active',
    mt: 'type',
    id: 'id',
    isbn: 'isbn',
    created_at: 'created_at',
    updated_at: 'updated_at',
    name: 'name',
    ft: 'tipo_archivo',
    tags: 'tags',
    categories: 'categories',
    category: 'category',
    unit: 'unit',
    units: 'units',
    core: 'core_resource_type'
}

const DICT_LANG_ALFRESCO = {
    es_ES: ['CAST', 'Castellano', 'CASTELLANO', 'castellano', 'español', 'Español', 'ESPAÑOL'],
    en_EN: ['Inglés', 'INGLÉS', 'inglés', 'English', 'ENGLISH', 'english', 'INGLES', 'ingles', 'Ingles'],
    ca_ES: ['Catalán', 'CATALÁN', 'catalán', 'Català', 'CATALÀ', 'català', 'Catalan', 'CATALAN', 'catalan'],
    eu_ES: ['Euskera', 'EUSKERA', 'euskera', 'Euskara', 'EUSKARA', 'euskara', 'Vasco', 'VASCO', 'vasco'],
    gl_ES: ['Gallego', 'GALLEGO', 'gallego', 'Galego', 'GALEGO', 'galego'],
    it_IT: ['Italiano', 'ITALIANO', 'italiano'],
    pt_PT: ['Portugués', 'PORTUGUÉS', 'portugués', 'Portugues', 'PORTUGUES', 'portugues'],
}
const DICT_LANG_XIMDEX = {
    es_ES: 'es',
    en_EN: 'en',
    ca_ES: 'ca',
    eu_ES: 'eu',
    gl_ES: 'gl',
    it_IT: 'it',
    pt_PT: 'pt'
}

// {
//     "query": {
//       "query": "(macgh:id:* AND NOT TYPE:\"{http://www.alfresco.org/model/content/1.0}folder\" AND (name:\"esto es una prueba\" OR properties.macgh:descripcion:\"esto es una prueba\" OR properties.macgh:isbn:\"esto es una prueba\" OR properties.macgh:isbn_digital:\"esto es una prueba\"))"
//     },
//     "include": ["properties"],
//     "sort": [{"type": "FIELD","field": "cm:title","ascending": true}]
//   }


export const toAlfrescoIn2Parser = (params: Object) => {
    let paramsAlfresco = []
    let paramsArray = Object.keys(params)

    paramsArray.forEach(param => {
        if (DICT_ALFRESCO.hasOwnProperty(param) || param === 'q') {
            let value = params[param]
            let search = '';
            if (param === 'ld' || param === 'la') param = 'l'
            if (param === 'l') {
                if (Array.isArray(value)) {
                    value = value.map(v => DICT_LANG_ALFRESCO[v] ?? [v])
                    value = value.flat()
                } else {
                    value = DICT_LANG_ALFRESCO[value] ?? [value]
                }
                value = value.map(v => `${DICT_ALFRESCO['l']}:"${v}"`)
                search = paramsArray.length === 1
                    ? value.join(' OR ')
                    : `(${value.join(' OR ')})`;
            }
            if (param === 's') {
                value = (value === 'true' || value === true) ? 'abierto' : 'cerrado'
            }
            if (param === 'q') {
                let params_search = [
                    `${DICT_ALFRESCO['isbn_digital']}:"${value}"`,
                    `${DICT_ALFRESCO['isbn']}:"${value}"`,
                    `${DICT_ALFRESCO['name']}:"${value}"`,
                    `${DICT_ALFRESCO['description']}:"${value}"`,
                    `${DICT_ALFRESCO['id']}:"${value}"`
                ]
                search = paramsArray.length === 1
                    ? params_search.join(' OR ')
                    : `(${params_search.join(' OR ')})`;
            }
            if (!search) {
                const searches = Array.isArray(value)
                    ? value.map(v => `${DICT_ALFRESCO[param]}:"${v}"`)
                    : [`${DICT_ALFRESCO[param]}:"${value}"`]
                search = `(${searches.join(' OR ')})`
            }
            paramsAlfresco.push(search)
        }
    })
    return paramsAlfresco.join(' AND ')
}

export const toXimdexParser = (params: Object) => {
    let paramsXimdex = {}
    let paramsArray = Object.keys(params)
    if (paramsArray.length === 0) {
        paramsXimdex['q'] = '*:*'
        return paramsXimdex;
    }
    if (paramsArray.length === 1 && paramsArray[0] === 'q') {
        const value = params[paramsArray[0]];
        paramsXimdex[DICT_XIMDEX['name']] = value
        paramsXimdex[DICT_XIMDEX['rt']] = value;
        paramsXimdex[DICT_XIMDEX['r']] = value;
        paramsXimdex[DICT_XIMDEX['cp']] = value;
        paramsXimdex[DICT_XIMDEX['cpr']] = value;
        paramsXimdex[DICT_XIMDEX['acc']] = value;
        paramsXimdex[DICT_XIMDEX['l']] = value;
        paramsXimdex[DICT_XIMDEX['s']] = value;
        paramsXimdex[DICT_XIMDEX['mt']] = value;
        paramsXimdex[DICT_XIMDEX['tags']] = value;
        paramsXimdex[DICT_XIMDEX['categories']] = value;

        return paramsXimdex
    }

    if (paramsArray.includes('c') && CORE_FILTERS[params['c']]) {
        paramsArray = paramsArray.filter(param => CORE_FILTERS[params['c']].includes(param))
    } else {
        paramsArray = paramsArray.filter(param => COMMON_FILTERS.includes(param))
    }
    paramsArray.forEach(param => {
        if (DICT_XIMDEX.hasOwnProperty(param)) {
            let value = params[param]
            if (param === 'l') {
                value = DICT_LANG_XIMDEX[value] ?? value
            }
            if (param === 's') {
                value = value === 'true' || value === true
            }
            if (param === 'units') param = 'unit'
            if (param === 'q') {
                paramsXimdex[DICT_XIMDEX['name']] = value;
                paramsXimdex[DICT_XIMDEX['tags']] = value;
                paramsXimdex[DICT_XIMDEX['categories']] = value;
                return;
            }
            paramsXimdex[DICT_XIMDEX[param]] = value
        }
    })
    return paramsXimdex
}

export const FromAlfrescoIn2Parser = (data) => {
    let type = ContentTypes['Paquete SCORM'];
    const parsedResource: ResourceType = {
        type: 'external',
        ID: data.entry.id,
        core: 'book',
        name: data.entry.name,
        language: 'es_ES',
        status: data.entry.properties?.['macgh:estado_proyecto'] === 'abierto',
        resource_type: type,
        created_at: new Date(data.entry.createdAt),
        updated_at: new Date(data.entry.modifiedAt),
        link: `${SOLR_ALFRESCO_URL}/share/page/site/${ALFRESCO_SITE}/document-details?nodeRef=workspace%3A%2F%2FSpacesStore%2F${data.entry.id}`
    };
    let lang = data.entry.properties['macgh:idioma'].toLowerCase();
    if (data.entry?.properties?.['cm:description']) parsedResource.description = data.entry?.properties?.['cm:description']
    if (lang) {
        Object.keys(DICT_LANG_ALFRESCO).forEach(language => {
            if (DICT_LANG_ALFRESCO[language].includes(lang)) {
                parsedResource.language = language
            }
        })

    }
    if (data.entry.isFolder) {
        type = ContentTypes.Directorio
    } else if (!data.entry?.name?.endsWith?.('.zip')) {
        if (data.entry.nodeType === 'macgh:documento_original') {
           type = ContentTypes.Documento
        }
        if (data.entry.nodeType === 'macgh:media') {
            if (data.entry?.content?.mimeType.startsWith('audio')) {
                type = ContentTypes.Audio
            } else if (data.entry?.content?.mimeType.startsWith('video'))  {
                type = ContentTypes.Vídeo
            } else if (data.entry.name.endsWith('.indd') ||
                data.entry.name.endsWith('.idml') ||
                data.entry.name.endsWith('.xml') ||
                data.entry.name.endsWith('.cxml')
            ) {
                type = ContentTypes.Infografía
            } else {
                type = ContentTypes.Ilustración
            }
        }
    }
    parsedResource.resource_type = type;

    if (type !== ContentTypes.Infografía && type !== ContentTypes["Paquete SCORM"]) {
        parsedResource.core = 'multimedia'
    }

    if (data.entry.properties['macgh:isbn_digital']) {
        parsedResource['isbn'] = [data.entry.properties['macgh:isbn_digital']]
    } else if (data.entry.properties['macgh:isbn']) {
        parsedResource['isbn'] = [data.entry.properties['macgh:isbn']]
    }
    if (data.entry.properties?.['macgh:tipo_proyecto']) {
        parsedResource['project_type'] = data.entry.properties?.['macgh:tipo_proyecto']
    }
    if (data.entry.properties?.['macgh:estado_proyecto']) {
        parsedResource['receiver'] = data.entry.properties?.['macgh:estado_proyecto']
    }
    if (data.entry.properties?.['macgh:estado_proyecto']) {
        parsedResource['cognitive_process'] = data.entry.properties?.['macgh:estado_proyecto']
    }
    if (data.entry.properties?.['macgh:estado_proyecto']) {
        parsedResource['copyright'] = data.entry.properties?.['macgh:estado_proyecto']
    }
    if (data.entry.properties?.['macgh:estado_proyecto']) {
        parsedResource['accessibility'] = data.entry.properties?.['macgh:estado_proyecto']
    }
    if (data.entry.properties?.['macgh:estado_proyecto']) {
        parsedResource['level'] = data.entry.properties?.['macgh:estado_proyecto']
    }
    if (data.entry.properties?.['macgh:estado_proyecto']) {
        parsedResource['skill'] = data.entry.properties?.['macgh:estado_proyecto']
    }
    if (data.entry.properties?.['macgh:estado_proyecto']) {
        parsedResource['discipline'] = data.entry.properties?.['macgh:estado_proyecto']
    }
    if (data.entry.properties?.['macgh:tipo_media']) {
        parsedResource['type_file'] = data.entry.properties?.['macgh:tipo_media']
    }
    if (data.entry.properties?.['macgh:anyo']) {
        parsedResource['year'] = data.entry.properties?.['macgh:anyo']
    } else {
        parsedResource['year'] = data.entry.properties?.['cm:fecha_publicacion']?.split('-')[0] ?? 'N/A'
    }
    if (data.entry.properties?.['macgh:area_escolar']) {
        parsedResource['area'] = data.entry.properties?.['macgh:area_escolar'] ?? 'N/A'
    }
    if (data.entry.properties?.['macgh:familia']) {
        parsedResource['family'] = data.entry.properties?.['macgh:familia'] ?? 'N/A'
    }
    return parsedResource;
}

const parseLang = (lang) => {
    if (Array.isArray(lang)) lang = lang[0]
    if (lang) lang = lang.replace('-', '_')
    switch (lang) {
        case 'en':
            lang = 'en_EN'
            break;
        case 'es':
            lang = 'es_ES'
            break;
        case 'ca':
        case 'cat':
            lang = 'ca_ES'
            break;
        case 'gl':
            lang = 'gl_ES'
            break;
        case 'eu':
            lang = 'eu_ES'
            break;
        default:
            break;
    }
    return lang
}

export const FromXimdexParser = (data) => {
    let lang = parseLang(data.lang ?? data.language ?? data.language_default)

    const parsed =  {
        type: 'internal',
        project_type: 'digital',
        ID: data.id,
        core: data.type,
        name: data.name,
        language: lang,
        status: data.active,
        resource_type: getResourceType(data.core_resource_type[0], data.type),
        receiver: data.destinatario || '',
        cognitive_process: data.proceso_cognitivo || '',
        copyright: data.derechos_autor || '',
        accessibility: data.accesibilidad || '',
        level: data.nivel_educativo || '',
        skill: data.competencia || '',
        discipline: data.disciplina || '',
        type_file: data.tipo_archivo || '',
        created_at: new Date(data.created_at[0]),
        updated_at: new Date(data.updated_at[0]),
        area: data.nivel_educativo ?? 'N/A',
        family: data.competencia ?? 'N/A'

    };

    if (data.description) {
        parsed['description'] = data.description
    }

    if (data?.previews?.[0]) {
        parsed['img'] = data?.previews?.[0]
    }

    if (data.unit) {
        parsed['unit'] = Array.isArray(data.unit) ? data.unit : [data.unit]
    }
    if (data.units) {
        parsed['units'] = Array.isArray(data.units) ? data.units : [data.units]
    }
    if (data.isbn) {
        parsed['isbn'] = Array.isArray(data.isbn) ? data.isbn : [data.isbn]
    } else {
        parsed['isbn'] = ['N/A']
    }

    if (data.core_resource_type[0] === 'activity' || data.core_resource_type[0] === 'assessment') {
        parsed['languages_allowed'] = data.available_languages.map(e => parseLang(e.replace('-', '_')))
        console.log('lant', parsed['languages_allowed'])
    }

    if (data.core_resource_type[0] === 'activity') parsed['activity_type'] = data.type
    if (data.core_resource_type[0] === 'multimedia') parsed['multimedia_type'] = data.type

    parsed['year'] = parsed.created_at.getFullYear()
    return parsed;
}

function getResourceType(core, subtype) {
    let type = ContentTypes["Paquete SCORM"]
    switch (core) {
        case 'activity':
        case 'activity_v3':
            type = ContentTypes.Actividad
            break;
        case 'assessment':
        case 'assessment_v3':
            type = ContentTypes.Cuestionario
            break;
        case 'multimedia':
        case 'multimedia_v3':
            if (subtype === 'video') type = ContentTypes.Vídeo
            if (subtype === 'audio') type = ContentTypes.Locución
            if (subtype === 'image') type = ContentTypes.Fotografía
            break;
        case 'book':
        case 'book_v3':
            type = ContentTypes["Paquete SCORM"]
            break;
        default:
            break;
    }
    return type
}
