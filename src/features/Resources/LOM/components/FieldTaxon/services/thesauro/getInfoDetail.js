const URI_SEARCH = process.env.REACT_APP_DEFINITION_INFO

const getDetailInfo = async id => {
    const url = URI_SEARCH.includes('%%ximdex_id%%') ? URI_SEARCH.replace('%%ximdex_id%%', id) : `${URI_SEARCH}?id=${id}&vocabulary=1&lang=1`
    const respo = await fetch(url)
    const json = await respo.json();
    return handleResponseThesauro(json)
}

const handleResponseThesauro = response => {
    const data = response.graph;
    let output = {
        suggestions: [],
        scopeNote: ''
    }

    Object.values(data).forEach(item => {
        if (item.type === 'skos:Concept') {
            Object.values(item.prefLabel).forEach(label => {
                if (label.lang === 'en') output.suggestions.push({
                    name: label.value,
                    id: item.uri.replace("http://vocabularies.unesco.org/thesaurus/", ""),
                    uri: item.uri
                })
            })
            if (item.hasOwnProperty("skos:scopeNote")) {
                Object.values(item['skos:scopeNote']).forEach(lang => {
                    if (lang.lang === 'en') output.scopeNote = lang.value
                })
            }
        }
    })
    return output
}

export default getDetailInfo