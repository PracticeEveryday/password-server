import { Injectable } from '@nestjs/common';
import { EnvService } from '../../env/env.service';
import { EnvEnum } from '../../env/envEnum';
import * as CryptoJS from 'crypto-js';
import { GetRecommendPasswordResDto } from '../../../apps/server/password/dto/api-dto/recommendPassword.res.dto';

@Injectable()
export class PasswordUtilService {
  private readonly PASSWORD_KEY: string;

  constructor(private readonly envService: EnvService) {
    this.PASSWORD_KEY = envService.get(EnvEnum.PASSWORD_KEY);
  }

  /**
   * 비밀번호를 암호화합니다.
   * @param password 비밀번호 Str
   */
  public hashPassword = (password: string): string => {
    const encrypted = CryptoJS.AES.encrypt(password, this.PASSWORD_KEY);
    return encrypted.toString();
  };

  /**
   * 해싱된 비밀번호를 복호화합니다.
   * @param hashPassword 해싱된 비밀번호
   */
  public decodedPassword = (hashPassword: string) => {
    const bytes = CryptoJS.AES.decrypt(hashPassword, this.PASSWORD_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  /**
   * 원하는 길이만큼의 무작위 비밀번호를 추천합니다.
   * @param lengthNum 길이 숫자
   */
  public recommendRandomPassword = (lengthNum: number): GetRecommendPasswordResDto => {
    const NUMBERS = '0123456789';
    const SPECIAL_CHARS = '!@#$%^&*()_-+=<>?';
    const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz';
    const UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    let password = '';

    for (let i = 0; i < lengthNum; i++) {
      const randomChars = [SPECIAL_CHARS, NUMBERS, LOWERCASE_CHARS, UPPERCASE_CHARS][Math.floor(Math.random() * 4)];
      password += this.getRandomChar(randomChars);
    }

    return new GetRecommendPasswordResDto(password);
  };

  /**
   * 전달 받은 문자 중 하나를 반환합니다.
   * @param str string 문자열
   */
  private getRandomChar(str: string): string {
    return str[Math.floor(Math.random() * str.length)];
  }
}
