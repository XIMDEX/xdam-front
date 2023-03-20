import { getValidLoms } from "./utils/utils";

//CONSTANTS
export const {
  REACT_APP_API_BASE_URL: API_BASE_URL,
  REACT_APP_COURSE_EDITOR_URL: COURSE_EDITOR_URL,
  REACT_APP_BOOK_EDITOR_URL: BOOK_EDITOR_URL, 
  REACT_APP_XTAGS_API_BASE_URL: XTAGS_API_BASE_URL
} = process.env
export const VALID_LOMS = process.env.REACT_APP_VALID_LOMS?.split(',') ?? []

//ENTITIES
export const ORGANIZATION = 'organization';
export const COLLECTION = 'collection';
export const WORKPSACES = 'workspaces';

//RESOURCES
export const COURSE = 'course';
export const MULTIMEDIA = 'multimedia';
export const IMAGE = "image";
export const VIDEO = "video";
export const AUDIO = "audio"; 
export const BOOK = 'book';
export const ACTIVITY = 'activity';
export const ASSESSMENT = 'assessment';

//FACETS
export const ACTIVE_FACET = 'active';
export const LANGUAGE_FACET = 'lang';

// LOM Standars
export const LOM_NORMAS = {
  lom: {name: 'LOM', key: 'lom'},
  lomes: {name: 'LOM-ES', key:'lomes'}
}

export const VALIDS_LOM = getValidLoms()

export const XTAGS =  {
  vocabularyId: 1, 
  langId: 1,
  lang: 'en',
  typeId: 1
}

export const COOKIE_NAME = 
  process.env?.REACT_APP_KAKUMA?.includes('kakumav1.pre-cloud') 
    ? 'USERDATA_SEK_PRE' 
    : process.env?.REACT_APP_KAKUMA?.includes('kakumav1.cloud') 
    ? 'USERDATA_SEK'
    : null;

export const NUM_SUGGESTIONS = 5;

export const PATH_TAXONS_DATA = '9.formData.Taxon Path';

export const MAX_BOOK_UNITS = 50;
export const CURRENT_BOOK_VERSION = 2

export enum bookLanguages {
  en = "English",
  es = "Castellano",
  cat = "Català",
  false = "Undefined"
}

export enum activeOptions {
  true = "Activo",
  false = "No activo"
}