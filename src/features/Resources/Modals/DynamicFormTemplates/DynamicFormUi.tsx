import { CustomDropdown, CustomInputText, CustomToggle, InputTextArea } from "./CustomFields";

const DynamicFormUi={
    
    "description": {
      "ui:order": ["active", 'enhanced', "*"],
      "active": {
        "ui:widget": CustomToggle,
      },
      "enhanced": {
        "ui:widget": CustomToggle,
      },
      "course_source": {
        "ui:widget": CustomDropdown,
        "ui:options":{
          label: 'Course source'
        }
      },
      "id": {
          "ui:options": {
            "ui:disable": true
          },
          "ui:disabled": true
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
      "body": {
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
        "ui:options":{
          "title": 'External url'
        }
      },
    }
  }
export default DynamicFormUi;