import * as CryptoJS from 'crypto-js';

import { GetRecommendPasswordResDto } from '@apps/server/modules/password/dto';
export class PasswordUtil {
  /**
   * 비밀번호를 암호화합니다.
   *
   * @param password 비밀번호 Str
   * @param key 해쉬할 키!
   */
  public static hashPassword = (password: string, key: string): string => {
    const encrypted = CryptoJS.AES.encrypt(password, key);
    return encrypted.toString();
  };

  /**
   * 해싱된 비밀번호를 복호화합니다.
   *
   * @param hashPassword 해싱된 비밀번호
   * @param key 해쉬할 키!
   */
  public static decodedPassword = (hashPassword: string, key: string) => {
    const bytes = CryptoJS.AES.decrypt(hashPassword, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  /**
   * 원하는 길이만큼의 무작위 비밀번호를 추천합니다.
   * @param lengthNum 길이 숫자
   */
  public static recommendRandomPassword = (lengthNum: number): GetRecommendPasswordResDto => {
    const NUMBERS = '0123456789';
    const SPECIAL_CHARS = '!@#$%^&*()_-+=<>?';
    const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz';
    const UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    let password = '';

    for (let i = 0; i < lengthNum; i++) {
      const randomChars = [SPECIAL_CHARS, NUMBERS, LOWERCASE_CHARS, UPPERCASE_CHARS][Math.floor(Math.random() * 4)];
      password += PasswordUtil.getRandomChar(randomChars);
    }

    return new GetRecommendPasswordResDto(password);
  };

  /**
   * 전달 받은 문자 중 하나를 반환합니다.
   * @param str string 문자열
   */
  public static getRandomChar(str: string): string {
    return str[Math.floor(Math.random() * str.length)];
  }
}
