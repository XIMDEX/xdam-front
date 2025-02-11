import { Cookies } from 'react-cookie';
import { COURSE, BOOK, MULTIMEDIA, IMAGE, VIDEO, AUDIO, ACTIVITY, ASSESSMENT, DOCUMENT, BOOK_EDITOR_URL, COURSE_EDITOR_URL, DEFAULT_THEME_BOOK, ENABLE_COGNITIVE } from '../constants';
import MainService from '../api/service';

class ResourcesService {

    getMultimediaActions()
    {
      return {
        create: { href: '', label: '' }
      }
    }

    getBookActions(resourceId, theme, accessibility = false)
    {
      let baseUrl = BOOK_EDITOR_URL;
      let edit = 'edit/';
      let convert = 'convert/';
      let token = 'vd9NxuORVjd8xlkZfqAfEQjJw4rXuuPEVysaEV1T';
      let rid = resourceId + '/';

      let ob = {
        edit: { label: 'Edit', href: baseUrl + edit + rid + token },
        convert: { label: 'Convert', href: baseUrl + convert + rid + token + `?theme=${encodeURIComponent(theme)}&accessibility=${accessibility}`},
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

    getDocumentActions()
    {
        const actions = {
            create: { href: '', label: '' }
        }

        if (ENABLE_COGNITIVE) {
            actions['view'] = {
                href: (data) => window.parent.postMessage({ type: "cognitrek", content: 'visor', data: data }, '*'),
                label: 'View'
            };
            actions['edit'] = {
                href: (data) => window.parent.postMessage({ type: "cognitrek", content: 'editor', data: data }, '*'),
                label: 'Editor'
            };

        }
        return actions
    }

    getActions(resource) {
      let ra = {}

      switch (resource.type) {
        case COURSE:
          ra = this.getCourseActions();
          break;
        case BOOK:
          ra = this.getBookActions(resource.id, resource.theme ?? DEFAULT_THEME_BOOK, resource.accessibility);
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
        case DOCUMENT:
          ra = this.getDocumentActions();
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
