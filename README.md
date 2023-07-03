# password-repo
도메인의 비밀번호를 항상 까먹어서 암호화 하여 저장하기 위해 만든 BackEnd 서버입니다.
화면은 따로 없고 `readline` 내장 모듈을 사용하여 진행합니다.

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
