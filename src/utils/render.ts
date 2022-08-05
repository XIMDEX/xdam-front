import MainService from "../api/service";

export const render = (data, quality = 'small'): string =>
{
    const defaultImage = 'noimg.png';
    const defaultAudioImage = 'audio.png';
    let url;
    
    if (data.hasOwnProperty('previews')) {
        url = MainService().render(data.previews[0]) + '/' + quality;
        url = url.includes('@@dam:@audio@') ? defaultAudioImage : url;
        return url;
    }
    
    if (data?.data?.description?.hasOwnProperty('media_upload')) {
        return data?.data?.description?.media_upload_type === 'audio' 
            ?  defaultAudioImage 
            : MainService().render(data.data.description.media_upload)
    }
    
    return defaultImage;
}

export const renderFromUrl = (url, quality = 'small'): string =>
{
    return MainService().render(url) + '/' + quality   
}