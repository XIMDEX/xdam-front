
var signal = null
var controller = null

async function searchTags(url, query) {
    if (signal !== null) {
        controller.abort();
    }
    controller = new AbortController();
    signal = controller.signal;
    try {
        const response = await fetch(`${url}${query}`, {signal})
        const body = await response.json();
        return body[0]  
    } catch (e) {
        return []
    }
}

export default searchTags