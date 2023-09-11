export class ValidateUtil {
  /**
   * 값이 비어있는지 확인함. 비어있으면 true, 아닐 시 false
   *
   * @param val unknown
   */
  public static checkEmptyStrictly(val: unknown) {
    const emptyCondition = val === '' || val === null || val === undefined || (typeof val === 'object' && !Object.keys(val).length);

    // 비어 있으면 true
    return emptyCondition;
  }
}
