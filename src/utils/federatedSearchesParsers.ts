import { COMMON_FILTERS, CORE_FILTERS } from "../features/Search/constants"
import { render } from "./render"

type ResourceType = {
    type: 'internal'|'external'
    ID: String, // UUID
    core: 'book'|'multimedia'|'activity'|'assessment',
    name:  String,
    description?: String,
    img?: String,
    language: 'es_ES'|'en_EN'|'cat_ES',
    status: Boolean,
    resource_type: 'Fotografía'|'Ilustración'|'Vídeo'|'Animación'|'Locución'|'Infografía'|'Documento'|'Actividad'|'Presentación'|'Cuestionario'|'Base de datos'|'Programaciones'|'Solucionarios'|'Paquete SCORM',
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
    languages_allowed?: Array<'es_ES'|'en_EN'|'cat_ES'>
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
    id: 'id',
    isbn: 'isbn',
    created_at: 'createdAt',
    updated_at: 'modifiedAt',
    name: 'cm:name',
    year: 'macgh:anyo'
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
    es_ES: 'Castellano',
    en_EN: 'Inglés',
    ca_ES: 'Catalán',
    eu_ES: 'Euskera'
}
const DICT_LANG_XIMDEX = {
    es_ES: 'es',
    en_EN: 'en',
    ca_ES: 'ca',
    eu_ES: 'eu'
}

export const toAlfrescoIn2Parser = (params: Object) => {
    let paramsAlfresco = {}
    let paramsArray = Object.keys(params)
    if (paramsArray.length === 1 && paramsArray[0] === 'q') {
        const value = params[paramsArray[0]];
        paramsAlfresco[DICT_ALFRESCO['rt']] = value;
        paramsAlfresco[DICT_ALFRESCO['r']] = value;
        paramsAlfresco[DICT_ALFRESCO['cp']] = value;
        paramsAlfresco[DICT_ALFRESCO['cpr']] = value;
        paramsAlfresco[DICT_ALFRESCO['acc']] = value;
        paramsAlfresco[DICT_ALFRESCO['l']] = value;
        paramsAlfresco[DICT_ALFRESCO['s']] = value;
        paramsAlfresco[DICT_ALFRESCO['mt']] = value;
        paramsAlfresco[DICT_ALFRESCO['name']] = value
        paramsAlfresco[DICT_ALFRESCO['description']] = value
        paramsAlfresco[DICT_ALFRESCO['description']] = value;
        paramsAlfresco[DICT_ALFRESCO['project_type']] = value;

        return paramsAlfresco
    }

    paramsArray.forEach(param => {
        if (DICT_ALFRESCO.hasOwnProperty(param)) {
            let value = params[param]
            if (param === 'ld' || param === 'la') param = 'l'
            if (param === 'l') {
                value = DICT_LANG_ALFRESCO[value] ?? value
            }
            if (param === 's') {
                value = (value === 'true' || value === true) ? 'abierto' : 'cerrado'
            }
            if (param === 'q') {
                paramsAlfresco[DICT_ALFRESCO['name']] = value
                paramsAlfresco[DICT_ALFRESCO['description']] = value
                return;
            }
            paramsAlfresco[DICT_ALFRESCO[param]] = value
        }
    })
    return paramsAlfresco
}

export const toXimdexParser = (params: Object) => {
    let paramsAlfresco = {}
    let paramsArray = Object.keys(params)
    if (paramsArray.length === 0) {
        paramsAlfresco['q'] = '*:*'
        return paramsAlfresco;
    }
    if (paramsArray.length === 1 && paramsArray[0] === 'q') {
        const value = params[paramsArray[0]];
        paramsAlfresco[DICT_XIMDEX['name']] = value
        paramsAlfresco[DICT_XIMDEX['rt']] = value;
        paramsAlfresco[DICT_XIMDEX['r']] = value;
        paramsAlfresco[DICT_XIMDEX['cp']] = value;
        paramsAlfresco[DICT_XIMDEX['cpr']] = value;
        paramsAlfresco[DICT_XIMDEX['acc']] = value;
        paramsAlfresco[DICT_XIMDEX['l']] = value;
        paramsAlfresco[DICT_XIMDEX['s']] = value;
        paramsAlfresco[DICT_XIMDEX['mt']] = value;
        paramsAlfresco[DICT_XIMDEX['tags']] = value;
        paramsAlfresco[DICT_XIMDEX['categories']] = value;

        return paramsAlfresco
    }

    if (paramsArray.includes('c') && CORE_FILTERS[params['c']]) {
        paramsArray = paramsArray.filter(param => CORE_FILTERS[params['c']].includes(param))
    } else {
        paramsArray = paramsArray.filter(param => COMMON_FILTERS.includes(param))
    }
    paramsArray.forEach(param => {
        if (DICT_XIMDEX.hasOwnProperty(param)) {
            let value = params[param]
            // if (param === 'ld' || param === 'la') {
            //     param = 'l'

            // }
            if (param === 'l') {
                value = DICT_LANG_XIMDEX[value] ?? value
            }
            if (param === 's') {
                value = value === 'true' || value === true
            }
            if (param === 'units') param = 'unit'
            if (param === 'q') {
                paramsAlfresco[DICT_XIMDEX['name']] = value;
                paramsAlfresco[DICT_XIMDEX['tags']] = value;
                paramsAlfresco[DICT_XIMDEX['categories']] = value;
                return;
            }
            paramsAlfresco[DICT_XIMDEX[param]] = value
        }
    })
}

export const FromAlfrescoIn2Parser = (data) => {
    const parsedResource: ResourceType = {
        type: 'external',
        ID: data.entry.id,
        core: 'book',
        name: data.entry.name,
        language: 'es_ES',
        status: data.entry.properties?.['macgh:estado_proyecto'] === 'abierto',
        resource_type: 'Paquete SCORM',
        created_at: new Date(data.entry.createdAt),
        updated_at: new Date(data.entry.modifiedAt),
    };

    if (data.entry.properties['macgh:isbn']) {
        parsedResource['isbn'] = data.entry.properties['macgh:isbn']
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

    return parsedResource;


}

export const FromXimdexParser = (data) => {
    const parsed =  {
        type: 'internal',
        project_type: 'digital',
        ID: data.id,
        core: data.type,
        name: data.name,
        language: data.lang ?? data.language ?? data.language_default,
        status: data.active,
        resource_type: getResourceType(data.core_resource_type, data.type),
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
    };

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
    }

    if (data.core_resource_type === 'activity' || data.core_resource_type === 'assessment') {
        parsed['languages_allowed'] = data.available_languages
    }

    if (data.core_resource_type === 'activity') parsed['activity_type'] = data.type
    if (data.core_resource_type === 'multimedia') parsed['multimedia_type'] = data.type

    return parsed;
}

function getResourceType(core, subtype) {
    let type = ''
    switch (core) {
        case 'activity':
        case 'activity_v3':
        case 'assessment':
        case 'assessment_v3':
            type = 'Actividad'
            break;
        case 'multimedia':
        case 'multimedia_v3':
            if (subtype === 'video') type = 'Vídeo'
            if (subtype === 'audio') type = 'Locución'
            if (subtype === 'image') type = 'Fotografía'
            break;
        case 'book':
        case 'book_v3':
            type = "Paquete SCORM"
            break;
        default:
            break;
    }
    return type
}
