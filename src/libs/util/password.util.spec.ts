import { PasswordUtil } from '@libs/util/password.util';

describe('PasswordUtil', () => {
  describe('비밀번호 해쉬', () => {
    it('비밀번호를 해쉬합니다.', () => {
      const password = 'myPassword';
      const key = 'myKey';
      const hashedPassword = PasswordUtil.hashPassword(password, key);
      expect(hashedPassword).not.toBe(password); // Ensure the password is hashed
    });
  });

  describe('비밀번호 디코드', () => {
    it('해쉬된 비밀번호를 반환합니다.', () => {
      const password = 'myPassword';
      const key = 'myKey';
      const hashedPassword = PasswordUtil.hashPassword(password, key);
      const decodedPassword = PasswordUtil.decodedPassword(hashedPassword, key);
      expect(decodedPassword).toBe(password);
    });
  });

  describe('랜덤 비밀번호 추천하기', () => {
    it('특정 길이의 비밀번호를 추천해줍니다.', () => {
      const lengthNum = 12;
      const recommendedPassword = PasswordUtil.recommendRandomPassword(lengthNum);
      expect(recommendedPassword.recommendedPassword).toHaveLength(lengthNum);
    });
  });

  describe('랜덤으로 스팰링 얻기', () => {
    it('입력 받은 문자열 중 하나를 랜덤으로 반환합니다.', () => {
      const inputString = 'abc123';
      const randomChar = PasswordUtil.getRandomChar(inputString);
      expect(inputString).toContain(randomChar); // a or b or c or 1 or 2 or 3
    });
  });
});
