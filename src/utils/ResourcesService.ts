import { Cookies } from 'react-cookie';
import { COURSE, BOOK, MULTIMEDIA, IMAGE, VIDEO, AUDIO, ACTIVITY, ASSESSMENT, BOOK_EDITOR_URL, COURSE_EDITOR_URL, KAKUMA_URL_API } from '../constants';
import MainService from '../api/service';

class ResourcesService {

    constructor()
    {

    }

    getMultimediaActions()
    {
      return {
        create: { href: '', label: '' }
      }
    }

    getBookActions(resourceId, theme)
    {
      let baseUrl = BOOK_EDITOR_URL;
      let edit = 'edit/';
      let convert = 'convert/';
      let token = 'vd9NxuORVjd8xlkZfqAfEQjJw4rXuuPEVysaEV1T';
      let rid = resourceId + '/';

      let ob = {
        edit: { label: 'Edit', href: baseUrl + edit + rid + token },
        convert: { label: 'Convert', href: baseUrl + convert + rid + token + `?theme=${encodeURIComponent(theme)}`},
      }

      return ob;
    }

    getActivityActions()
    {
      return {
        create: { href: '', label: '' }
      }
    }

    getAssessmentActions()
    {
      return {
        create: { href: '', label: '' }
      }
    }

    getCourseActions()
    {
      return {
        create: () => {
          window.open(COURSE_EDITOR_URL, '_blank').focus()
        },
        edit: { href: COURSE_EDITOR_URL, label: 'Editor' },
        getIMSC: {
            href: async (id) => {
                return await MainService().getIMSCC(id)
            },
            label: 'Get IMSCC'
        }
      }
    }

    getActions(resource) {
      const resourceActions = {
        COURSE: this.getCourseActions,
        BOOK: this.getBookActions,
        MULTIMEDIA: this.getMultimediaActions,
        IMAGE: this.getMultimediaActions,
        VIDEO: this.getMultimediaActions,
        AUDIO: this.getMultimediaActions,
        ACTIVITY: this.getActivityActions,
        ASSESSMENT: this.getAssessmentActions,
        SINGLE_CHOICE: this.getActivityActions,
        MULTIPLE_CHOICE: this.getActivityActions,
        TRUE_FALSE: this.getActivityActions,
        FILL_THE_BLANKS: this.getActivityActions,
        ORDER_CHRONOLOGY: this.getActivityActions,
        WORD_SEARCH: this.getActivityActions,
        WORD_CATCHER: this.getActivityActions,
        SEEK_AND_FIND: this.getActivityActions,
        CORRESPONDENCE: this.getActivityActions,
        FLASH_CARDS: this.getActivityActions,
        MATCH: this.getActivityActions,
        INPUT: this.getActivityActions,
        FIT_WORD: this.getActivityActions,
        RANK: this.getActivityActions,
        DEDUCTION: this.getActivityActions,
        OPINION_SCALE: this.getActivityActions,
        SHORT_QUESTION: this.getActivityActions,
        TEXT_CHOICE: this.getActivityActions,
        IMAGE_CHOICE: this.getActivityActions,
        TEXT_PAIRING: this.getActivityActions,
        IMAGE_PAIRING: this.getActivityActions,
        CARD_CHOICE: this.getActivityActions,
        FROGGY_JUMP: this.getActivityActions,
        INPUT_LONG: this.getActivityActions,
      };
      
      const result = resourceActions[resource.type.replace(/-/g, '_').toUpperCase()]();
      return result;
    }
}

export default function ResourcesActions()
{
  return new ResourcesService()
}
