import { Injectable } from '@nestjs/common';

@Injectable()
export class StringUtilService {
  /**
   * 스네이크케이스를 카멜 케이스로 변환하는 메서드
   * @param snakeCaseStr snakeCase string
   */
  public parseSnakeCaseToCamelCase(snakeCaseStr: string): string {
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

  /**
   * 카멜케이스를 스네이크 케이스로 변환하는 메서드
   * @param camelCaseStr camelCase string
   */
  public parseCamelCaseToSnameCase(camelCaseStr: string): string {
    const UNDER_SCORE = '_';
    let snakeCaseStr = '';
    const camelCaseArr = camelCaseStr.split('');
    camelCaseArr.forEach((str) => {
      if (this.isUpperCase(str)) {
        snakeCaseStr = snakeCaseStr + UNDER_SCORE;
        snakeCaseStr = snakeCaseStr + str.toLowerCase();
      } else {
        snakeCaseStr = snakeCaseStr + str;
      }
    });

    return snakeCaseStr;
  }

  /**
   * str 매개 변수가 대문자인지 확인하는 메서드
   * @param str string
   */
  public isUpperCase(str: string): boolean {
    return str === str.toUpperCase();
  }

  /**
   * str 매개 변수가 소문자인지 확인하는 매서드
   * @param str string
   */
  public isLowerCase(str: string): boolean {
    return str === str.toLowerCase();
  }
}
