import bookValidator from "./bookValidation";
import { ResourceValidation } from "./ResourceValidation";

const validators = {
    "book": {
        "convert": bookValidator
    }
}

const noValidation = () => new Promise<void>((resolve, _) => {
    resolve();
});


export default class ResourceValidationService {

    public static create(action: string, type: string): ResourceValidation {

        const validator = validators?.[type]?.[action];

        return validator || noValidation;
    }
}