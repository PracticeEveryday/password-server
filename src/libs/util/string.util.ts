export class StringUtil {
  /**
   * 스네이크케이스를 카멜 케이스로 변환하는 메서드
   * @param snakeCaseStr snakeCase string
   */
  public static parseSnakeCaseToCamelCase(snakeCaseStr: string): string {
    const UNSER_SCORE = '_';
    if (snakeCaseStr.indexOf(UNSER_SCORE) === -1) return snakeCaseStr;

    let camelCase = '';
    const snakeCaseArr = snakeCaseStr.split('');
    snakeCaseArr.forEach((str, idx) => {
      if (str === UNSER_SCORE) return;
      if (snakeCaseArr[idx - 1] === UNSER_SCORE) {
        camelCase = camelCase + str.toUpperCase();
        return;
      }

      camelCase = camelCase + str;
    });
    return camelCase;
  }
}
