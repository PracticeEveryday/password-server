import ErrorResponse from '@commons/customExceptions/errorResponse';
import { ConflictException, NotFoundException } from '@commons/customExceptions/exception';

export class ValidateUtil {
  public static isStrictEmptyWithErrorResponse(val: unknown, errorResponse: ErrorResponse) {
    const emptyCondition = val === '' || val === null || val === undefined || (typeof val === 'object' && !Object.keys(val).length);
    if (!emptyCondition) {
      throw new NotFoundException({ errorResponse });
    }
  }

  public static isStrictNotEmptyWithErrorResponse(val: unknown, errorResponse: ErrorResponse) {
    const emptyCondition = val === '' || val === null || val === undefined || (typeof val === 'object' && !Object.keys(val).length);

    if (emptyCondition) {
      throw new ConflictException({ errorResponse });
    }

    return true;
  }
}
