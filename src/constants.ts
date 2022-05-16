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

export const NUM_SUGGESTIONS = 5;

export const PATH_TAXONS_DATA = '9.formData.Taxon Path';

export const MAX_BOOK_UNITS = 50;

export enum bookLanguages {
  en = "english",
  es = "castellano",
  ca = "catalan"
}