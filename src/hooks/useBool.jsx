import { useState } from "react"

const useBool = (defaultValue = false) => {
    const [value, setValue] = useState(defaultValue);

    const toggleValue = () => {
        setValue(!value)
    }

    return [
        value,
        setValue,
        toggleValue
    ]
}

export default useBool;
