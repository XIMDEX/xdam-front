import { MAX_BOOK_UNITS } from "../../constants";

const isbnRegex = /^(?:ISBN(?:-10)?:?●)?(?=[0-9X]{10}$|(?=(?:[0-9]+[-●]){3})[-●0-9X]{13}$)[0-9]{1,5}[-●]?[0-9]+[-●]?[0-9]+[-●]?[0-9X]$/

export interface Book {
    isbn: string,
    units: number
}


function validateUnits(units: number): boolean {
    return typeof units === "number" && units >= 0 && units <= MAX_BOOK_UNITS
}

function evaluate(isValid: boolean, message: string): string | null {
    return !isValid
        ? message
        : null;
}

function validateIsbn(isbn: string): string | null {
    if(!isbn) return "The ISBN can't be empty";

    return evaluate(isbnRegex.test(isbn), `Invalid isbn: ${isbn}`);
}

export default function bookValidator(resource: Book): Promise < void> {

    console.log(resource);

    return new Promise((resolve, reject) => {
        const messages = [
            validateIsbn(resource.isbn),
            evaluate(validateUnits(resource.units), `Invalid number of units: ${resource.units}`)
        ].filter(m => m);

        messages.length > 0
            ? reject(messages.join(" | "))
            : resolve();
    });

}