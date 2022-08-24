import { MAX_BOOK_UNITS } from "../../constants";

const isbnRegex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]\´-/

export interface Book {
    isbn: string,
    unit: number
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

    if(isbn.length < 5) return `ISBN to short`;

    // let validateRegex = isbnRegex.test(isbn);
    let validateRegex = true;

    return evaluate(validateRegex, `Invalid isbn: ${isbn}`);
}

export default function bookValidator(resource: Book): Promise < void> {

    return new Promise((resolve, reject) => {
        const messages = [
            validateIsbn(resource.isbn),
            evaluate(validateUnits(resource.unit), `Invalid number of units: ${resource.unit}`)
        ].filter(m => m);

        messages.length > 0
            ? reject(messages.join(" | "))
            : resolve();
    });
}