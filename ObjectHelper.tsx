import ERROR_MESSAGE from './ErrorMessageKeys'

export default class ObjectHelper {
    /**
      Check whether the parameter is an object.
     */
    static isValid(obj: any): boolean  {
        return typeof obj === "object";
    }

    /**
      Check whether the parameter is undefined or an object.
     */
    static isValidOrUndefined(obj: any): boolean {
        return obj === undefined || ObjectHelper.isValid(obj);
    }

    /**
      Raise an object validation error.
     */
    static raiseError(paramName): void {
        throw new Error(`${paramName}${ERROR_MESSAGE.INVALID_OBJECT}`);
    }
}