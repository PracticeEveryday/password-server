import { Injectable } from '@nestjs/common';

@Injectable()
export class StringUtilService {
  public parseSnakeCaseToCamelCase(snakeCaseStr: string): string {
    const underScore = '_';
    if (snakeCaseStr.indexOf(underScore) === -1) return snakeCaseStr;

    let camelCase = '';
    const snakeCaseArr = snakeCaseStr.split('');
    snakeCaseArr.forEach((str, idx) => {
      if (str === underScore) return;
      if (snakeCaseArr[idx - 1] === underScore) {
        camelCase = camelCase + str.toUpperCase();
        return;
      }

      camelCase = camelCase + str;
    });
    return camelCase;
  }

  public makeWhere<T extends NonNullable<unknown>>(where: T) {
    //
  }
}
