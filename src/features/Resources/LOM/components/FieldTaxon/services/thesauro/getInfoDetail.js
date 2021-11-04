const URI_SEARCH = 'http://vocabularies.unesco.org/browser/rest/v1/thesaurus/data?uri=http%3A%2F%2Fvocabularies.unesco.org%2Fthesaurus%2F%%ximdex_id%%&format=application/ld%2Bjson'

const getDetailInfo = async id => {
    const url = URI_SEARCH.replace('%%ximdex_id%%', id)
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