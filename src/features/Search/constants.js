export const INIT_FILTER_QUERY = '*:*'
export const COMMON_FILTERS = ['l', 's', 'rt', 'r', 'cp', 'cpr', 'acc', 'll', 'sk', 'dp', 'ft'];
export const CORE_FILTERS = {
    multimedia: [...COMMON_FILTERS],
    activity: [...COMMON_FILTERS],
    assessment: [...COMMON_FILTERS],
    book: [...COMMON_FILTERS],
    alfresco: [...COMMON_FILTERS],
};

export const FILTERS = {
    c: {
        label: "Collection",
        multiple_selection: false,
        options: [
            { key: "multimedia", label: "multimedia", value: "multimedia" }, // image, video, audio
            { key: "activity", label: "activity", value: "activity" },
            { key: "assessment", label: "assessment", value: "assessment" },
            { key: "book", label: "book", value: "book" },
        ],
    },
    l: {
        label: "Language",
        option_label: "label",
        multiple_selection: true,
        options: [
            { label: "N/A", value: null },
            { label: "Español", value: "es_ES" },
            { label: "English", value: "en_EN" },
            { label: "Català", value: "ca_ES" },
            { label: "Euskera", value: "eu_ES" },
            { label: "Portugués", value: "pt_PT" },
            { label: "Italiano", value: "it_IT" },
        ],
    },
    ld: {
        label: "Language default",
        option_label: "label",
        multiple_selection: true,
        options: [
            { label: "N/A", value: null },
            { label: "Español", value: "es_ES" },
            { label: "English", value: "en_EN" },
            { label: "Català", value: "ca_ES" },
            { label: "Euskera", value: "eu_ES" },
            { label: "Portugués", value: "pt_PT" },
            { label: "Italiano", value: "it_IT" },
        ],
    },
    la: {
        label: "Available Languages",
        option_label: "label",
        multiple_selection: true,
        options: [
            { label: "N/A", value: null },
            { label: "Español", value: "es_ES" },
            { label: "English", value: "en_EN" },
            { label: "Català", value: "ca_ES" },
            { label: "Euskera", value: "eu_ES" },
            { label: "Portugués", value: "pt_PT" },
            { label: "Italiano", value: "it_IT" },
        ],
    },
    s: {
        filter_key: "active",
        label: "Status",
        multiple_selection: false,
        options: [
            { label: "Published", value: "true" },
            { label: "Draft", value: "false" },
        ],
    },
    rt: {
        label: "Resources Type",
        multiple_selection: true,
        options: [
            { label: "N/A", value: null },
            { label: "Fotografía", value: "Fotografía"},
            { label: "Ilustración", value: "Ilustración"},
            { label: "Vídeo", value: "Vídeo"},
            { label: "Audio", value: "Audio"},
            { label: "Animación", value: "Animación"},
            { label: "Locución", value: "Locución"},
            { label: "Infografía", value: "Infografía"},
            { label: "Documento", value: "Documento"},
            { label: "Actividad", value: "Actividad"},
            { label: "Presentación", value: "Presentación"},
            { label: "Cuestionario", value: "Cuestionario"},
            { label: "Base de datos", value: "Base de datos"},
            { label: "Programación", value: "Programación"},
            { label: "Solucionario", value: "Solucionario"},
            { label: "Paquete SCORM", value: "Paquete SCORM"},
            { label: "Proyecto", value: "Proyecto"},
            { label: "Evaluación", value: "Evaluación"},
        ],
    },
    r: {
        label: "Receiver",
        multiple_selection: true,
        options: [
            { label: "N/A", value: null },
            { label: "Profesor", value: "Profesor" },
            { label: "Alumno", value: "Alumno" },
            { label: "General", value: "General" },
        ],
    },
    cp: {
        label: "Cognition Process",
        multiple_selection: true,
        options: [
            { label: "N/A", value: null },
            { label: "Nivel 1: Recordar", value: "Nivel 1: Recordar" },
            { label: "Nivel 2: Comprender", value: "Nivel 2: Comprender" },
            { label: "Nivel 3: Aplicar", value: "Nivel 3: Aplicar" },
            { label: "Nivel 4: Analizar", value: "Nivel 4: Analizar" },
            { label: "Nivel 5: Evaluar", value: "Nivel 5: Evaluar" },
            { label: "Nivel 6: Crear", value: "Nivel 6: Crear" },
        ],
    },
    cpr: {
        label: "Copyright",
        multiple_selection: true,
        options: [
            { label: "N/A", value: null },
            { label: "Propietaria MHE", value: "Propietaria MHE" },
            { label: "Creative Comnmons", value: "Creative Comnmons" },
            { label: "De terceros", value: "De terceros" },
            { label: "Licencia GFDL", value: "Licencia GFDL" },
            { label: "Dominio público", value: "Dominio público" },
        ],
    },
    acc: {
        label: "Accessibility",
        multiple_selection: true,
        options: [
            { label: "N/A", value: null },
            { label: "Nivel de accesibilidad AA", value: "Nivel de accesibilidad AA" },
            { label: "Nivel de accesibilidad AAA", value: "Nivel de accesibilidad AAA" },
            { label: "Cumplimiento de la norma WCAG 2.1", value: "Cumplimiento de la norma WCAG 2.1" },
            { label: "Cumplimiento de la norma WCAG 2.2", value: "Cumplimiento de la norma WCAG 2.2" },
        ],
    },
    ll: {
        label: "Learning level",
        multiple_selection: true,
        disabled: true,
        options: [
            { label: "Pendiente de definir", value: ''}
        ],
    },
    sk: {
        label: "Skill",
        multiple_selection: true,
        disabled: true,
        options: [
            { label: "Pendiente de definir", value: ''}
        ],
    },
    dp: {
        label: "Discipline",
        multiple_selection: true,
        disabled: true,
        options: [
            { label: "Pendiente de definir", value: ''}
        ],
    },
    ft: {
        label: "File type",
        multiple_selection: true,
        options: [
            { label: "ZIP", value: 'application/zip'},
            { label: "PDF", value: 'application/pdf'},
            { label: "DOC", value: 'application/msword'},
            { label: "DOCX", value: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'},
            { label: "PPT", value: 'application/vnd.ms-powerpoint'},
            { label: "PPTX", value: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'},
            { label: "XLS", value: 'application/vnd.ms-excel'},
            { label: "XLSX", value: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'},
            { label: "ODT", value: 'application/vnd.oasis.opendocument.text'},
            { label: 'JPG', value: 'image/jpeg'},
            { label: 'PNG', value: 'image/png'},
            { label: 'GIF', value: 'image/gif'},
            { label: 'MP3', value: 'audio/mpeg'},
            { label: 'WAV', value: 'audio/wav'},
            { label: 'MP4', value: 'video/mp4'},
            { label: 'AVI', value: 'video/x-msvideo'},
            { label: 'MOV', value: 'video/quicktime'},
            { label: 'WMV', value: 'video/x-ms-wmv'},
            { label: 'FLV', value: 'video/x-flv'},
            { label: 'OGG', value: 'video/ogg'},
            { label: 'WEBM', value: 'video/webm'},
            { label: 'SVG', value: 'image/svg+xml'}
        ],
    },
    at: {
        label: "Activity type",
        multiple_selection: true,
        options: [
            {label: "Correspondence", value: "correspondence"},
            {label: "Fill in the blanks", value: "fill-the-blanks"},
            {label: "Fit-Word", value: "fit-word"},
            {label: "Input", value: "input"},
            {label: "Input Long", value: "input-long"},
            {label: "Match", value: "match"},
            {label: "Multiple choice", value: "multiple-choice"},
            {label: "Order chronology", value: "order-chronology"},
            {label: "Rank", value: "rank"},
            {label: "Seek and find", value: "seek-and-find"},
            {label: "Single choice", value: "single-choice"},
            {label: "True/False", value: "true-false"},
            {label: "Word catcher", value: "word-catcher"},
            {label: "Word search", value: "word-search"}
        ],
    },
    un: {
        label: "Units",
        multiple_selection: true,
        options: [
            { "label": 0, "value": "00" }, { "label": 1, "value": "01" }, { "label": 2, "value": "02" }, { "label": 3, "value": "03" }, { "label": 4, "value": "04" },
            { "label": 5, "value": "05" }, { "label": 6, "value": "06" }, { "label": 7, "value": "07" }, { "label": 8, "value": "08" }, { "label": 9, "value": "09" },
            { "label": 10, "value": "10" }, { "label": 11, "value": "11" }, { "label": 12, "value": "12" }, { "label": 13, "value": "13" }, { "label": 14, "value": "14" },
            { "label": 15, "value": "15" }, { "label": 16, "value": "16" }, { "label": 17, "value": "17" }, { "label": 18, "value": "18" }, { "label": 19, "value": "19" },
            { "label": 20, "value": "20" }, { "label": 21, "value": "21" }, { "label": 22, "value": "22" }, { "label": 23, "value": "23" }, { "label": 24, "value": "24" },
            { "label": 25, "value": "25" }, { "label": 26, "value": "26" }, { "label": 27, "value": "27" }, { "label": 28, "value": "28" }, { "label": 29, "value": "29" },
            { "label": 30, "value": "30" }, { "label": 31, "value": "31" }, { "label": 32, "value": "32" }, { "label": 33, "value": "33" }, { "label": 34, "value": "34" },
            { "label": 35, "value": "35" }, { "label": 36, "value": "36" }, { "label": 37, "value": "37" }, { "label": 38, "value": "38" }, { "label": 39, "value": "39" },
            { "label": 40, "value": "40" }, { "label": 41, "value": "41" }, { "label": 42, "value": "42" }, { "label": 43, "value": "43" }, { "label": 44, "value": "44" },
            { "label": 45, "value": "45" }, { "label": 46, "value": "46" }, { "label": 47, "value": "47" }, { "label": 48, "value": "48" }, { "label": 49, "value": "49" },
            { "label": 50, "value": "50" }
        ],
    },
    mt: {
        label: "Multimedia Type",
        multiple_selection: true,
        options: [
            {label: "Audio", value: "audio"},
            {label: "Video", value: "video"},
            {label: "Image", value: "image"},
            {label: "Document", value: "document"},
        ],
    }
}


export const PARAMS = {
    q: 'search',
    c: 'core',
    l: 'language',
    s: 'status',
    rt: 'resource_type',
    r: 'receiver',
    cp: 'cognitive_process',
    cpr: 'copyright',
    acc: 'accessibility',
    ll: 'level',
    sk: 'skill',
    dp: 'discipline',
    ft: 'type_file',
    at: 'activity_type',
    mt: 'multimedia_type',
    ld: 'language_default',
    la: 'languages_allow'
}

