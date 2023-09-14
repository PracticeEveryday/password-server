export class ValidateUtil {
  /**
   * 값이 비어있는지 확인함. 비어있으면 true, 아닐 시 false
   *
   * @param val unknown
   * @return 비어 있을 시 true를 반환함.
   */
  public static checkEmptyStrictly(val: unknown): boolean {
    return val === '' || val === null || val === undefined || (typeof val === 'object' && !Object.keys(val).length);
  }

  /**
   * 값이 들어있는지 확인함. 비어있으면 true, 아닐 시 false
   *
   * @param val unknown
   * @return 들어있을 경우 true를 반환함.
   */
  public static checkExistStrictly(val: unknown): boolean {
    return val !== '' && val !== null && val !== undefined && typeof val === 'object' && Object.keys(val).length !== 0;
  }

  public static checkOne(value: 1): boolean {
    return value === 1;
  }
}
