import { Injectable } from '@nestjs/common';
import { EnvService } from '../env/env.service';
import { EnvEnum } from '../env/envEnum';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class PasswordUtilService {
  private PASSWORD_KEY: string;
  constructor(private readonly envService: EnvService) {
    this.PASSWORD_KEY = envService.get(EnvEnum.PASSWORD_KEY);
  }

  public hashPassword = (password: string): string => {
    const encrypted = CryptoJS.AES.encrypt(password, this.PASSWORD_KEY);
    return encrypted.toString();
  };

  public decodedPassword = (hashPassword: string) => {
    const bytes = CryptoJS.AES.decrypt(hashPassword, this.PASSWORD_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  };
}
