import MainService from "../api/service";

export const render = (data, quality = 'small'): string =>
{
    const defaultImage = 'noimg.png';
    const defaultAudioImage = 'audio.png';   
    //console.log(data)
    
    if (data.hasOwnProperty('previews')) {
        let url = MainService().render(data.previews[0]) + '/' + quality;
        url = url.includes('@@dam:@audio@') ? defaultAudioImage : url;
        return url;
    // } else if (data.data.description?.hasOwnProperty('media_upload')) {
    //     return MainService().render(data.data.description.media_upload)
    } else {
        return defaultImage
    }
}

export const renderFromUrl = (url, quality = 'small'): string =>
{
    return MainService().render(url) + '/' + quality   
}