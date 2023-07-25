# ~~password-repo~~
~~도메인의 비밀번호를 항상 까먹어서 암호화 하여 저장하기 위해 만든 BackEnd 서버입니다.~~
아쉬웠던 부분 중 개발을 활용하여 해결할 수 있는 것을 찾아 만들어가는 서버입니다.
화면은 따로 없고 `readline` 내장 모듈을 사용하여 진행합니다.

### 서버 세팅

![password-server-setting](https://github.com/PracticeEveryday/password-server/assets/115522392/1487d886-8065-4c2c-9e5c-a22bfaaf032a)


### 서버 재시작
![password-server-start](https://github.com/PracticeEveryday/password-server/assets/115522392/7b585245-e98e-4974-9c02-12999e189770)

### 서버 재시작 실패시
![password-server-fail](https://github.com/PracticeEveryday/password-server/assets/115522392/4ec12942-f61c-49cf-990f-785c0e0e600c)


### 📰 필요한 것

1. DB(mysql)
2. .env 파일 생성

```dotenv
# 예시입니다.
#port info
PORT=8080
#login info for swagger
SWAGGER_USER=local
SWAGGER_PASSWORD=local1234
#password key you want
PASSWORD_KEY="My name is kdh"
#Your Database Info
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_DB=password
DATABASE_PASSWORD=password
```

### 🏃 서버 실행 script
```shell
git clone https://github.com/PracticeEveryday/password-server.git
cd password-server
yarn
yarn start:prod
```

### 🙏 테스트 API
1. Open Browser
2. http://localhost:{port}/api 입력
3. swagger Login
4. `GET /`
```json
{
  "result": "Hello World!"
}
```

### 📭 서버 시작을 하기 위한 [#1 플로우차트 링크](https://github.com/PracticeEveryday/password-server/issues/1)

### 기술 스택
1. 프레임워크: Nestjs v9.0.0
2. Nodejs: v18.14.2
3. DB: mysql
4. ETC: dayjs, mysql2...