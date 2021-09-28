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
  LOM: 'lom',
  LOMES: 'lomes'
}
export const VALIDS_LOM = [
  //* This is the order of the tab generation
  { name: 'LOM-ES', key: LOM_NORMAS.LOMES },
  { name: 'LOM', key: LOM_NORMAS.LOM }
]