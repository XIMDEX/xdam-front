import { Cookies } from 'react-cookie';
import { COURSE, BOOK, MULTIMEDIA, IMAGE, VIDEO, AUDIO, ACTIVITY, ASSESSMENT, BOOK_EDITOR_URL, COURSE_EDITOR_URL, DEFAULT_THEME_BOOK } from '../constants';
import MainService from '../api/service';

class ResourcesService {

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

      theme = process.env.REACT_APP_DEFAULT_THEME ?? 'base'

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
      let ra = {}

      switch (resource.type) {
        case COURSE:
          ra = this.getCourseActions();
          break;
        case BOOK:
          ra = this.getBookActions(resource.id, resource.theme ?? DEFAULT_THEME_BOOK);
          break;
        case MULTIMEDIA:
        case IMAGE:
        case VIDEO:
        case AUDIO:
          ra = this.getMultimediaActions();
          break;
        case ACTIVITY:
          ra = this.getActivityActions();
          break;
        case ASSESSMENT:
          ra = this.getAssessmentActions();
          break;
        default:
          throw new Error('resource type invalid: ' + resource.type)
      }

      return ra;
    }
}

export default function ResourcesActions()
{
  return new ResourcesService()
}
