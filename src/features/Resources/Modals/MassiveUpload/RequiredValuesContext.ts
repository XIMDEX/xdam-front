import React from 'react';

export interface RequireValues {
    conversionAfterUpload: boolean
}

const RequiredValuesContext = React.createContext<RequireValues>({
    conversionAfterUpload: false
});

export default RequiredValuesContext;