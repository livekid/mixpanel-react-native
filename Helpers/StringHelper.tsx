import ERROR_MESSAGE from '../ErrorMessageKeys'

export default class StringHelper {
    /**
      Check whether the parameter is not a blank string.
     */
    static isValid(str: string): boolean {
        return typeof str === "string" && !(/^\s*$/).test(str);
    }

    /**
      Check whether the parameter is undefined or not a blank string.
     */
    static isValidOrUndefined(str: string): boolean {
        return str === undefined || StringHelper.isValid(str);
    }

    /**
      Raise a string validation error.
     */
    static raiseError(paramName: string) {
        throw new Error(`${paramName}${ERROR_MESSAGE.INVALID_STRING}`);
    }
}
