import { STRICT_CATEGORIES } from "../constants"
import ArrayFieldTemplate from "../features/Resources/Modals/DynamicFormTemplates/ArrayFieldTemplate"
import { CustomToggle, CustomDropdown, CustomBookNumberOfUnitSelector, InputTextArea, CustomInputText } from "../features/Resources/Modals/DynamicFormTemplates/CustomFields"
import { ResourceLanguage } from "../features/Resources/Modals/DynamicFormTemplates/ResourceLanguage"
import { ResourceType } from "../types/Resources/ResourceType"
import useCategories from "./useCategories"

const commonSchema = {
    "description": {
        "ui:order": ["active", "*"],
        "active": {
            "ui:widget": CustomToggle,
        },
        "course_source": {
            "ui:widget": CustomDropdown,
            "ui:options": {
                label: 'Course source'
            }
        },
        "unit": {
            "ui:widget": CustomBookNumberOfUnitSelector,
            "ui:options": {
                "max": 50
            }
        },
        "partials": {
            "pages": {
                "ui:widget": "hidden",
            }
        },
        "description": {
            "ui:widget": InputTextArea,
            "ui:options": {
                "rows": 5
            }
        },
        "name": {
            "ui:widget": CustomInputText,
        },
        "external_url": {
            "ui:widget": CustomInputText,
            "ui:options": {
                "title": 'External url'
            }
        },
        "lang": {
            "ui:widget": ResourceLanguage,
            "ui:options": {
                opt: ["es", "cat", "en"],
                label: 'Language'
            }
        },
        "extra": {
            "ui:field": "bookExtraData",
        },
    }
}

const typeToSchemaMap: Record<keyof typeof ResourceType, any> = {
    COURSE: {
        "description": {
            "categories": {
                "ui:ArrayFieldTemplate": STRICT_CATEGORIES ? null : ArrayFieldTemplate,
                "ui:options": {
                    categories: useCategories,
                    singleCategory: true,
                }
            },
        }
    },
    DOCUMENT: undefined,
    VIDEO: undefined,
    IMAGE: undefined,
    AUDIO: undefined,
    URL: undefined,
    MULTIMEDIA: undefined,
    ASSESSMENT: undefined,
    ACTIVITY: undefined,
    BOOK: undefined
}

const useUiSchema = (type: string) => {

    const particularResourceSchema = typeToSchemaMap[type.toUpperCase() as ResourceType];

    if (!particularResourceSchema) {
        return commonSchema;
    }

    return {
        ...commonSchema,
        ...particularResourceSchema,
        "description": {
            ...commonSchema.description,
            ...particularResourceSchema.description,
        }
    }
}

export default useUiSchema;