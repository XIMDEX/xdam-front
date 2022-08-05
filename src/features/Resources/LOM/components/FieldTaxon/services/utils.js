
export const checkValueExistInArray = (value, array, keyValue = null, keyArray = null) => {
    if (keyValue) value = value[keyValue] 
    
    return array.some(element => {
        if (keyArray) element = element[keyArray]
        return element === value;
    })
}