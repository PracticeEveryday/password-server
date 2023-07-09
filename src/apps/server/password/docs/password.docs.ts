export const createPasswordSuccMd = `🥳 비밀번호 저장을 성공하였습니다.`;
export const createPasswordDescriptionMd = `
### 💬 도메인의 비밀번호를 저장하는 API입니다.\n 
비밀번호는 [AES 암호화](https://namu.wiki/w/AES)로 해싱되어 저장됩니다.
`;
export const createPasswordSummaryMd = `✅ Domain의 Password를 저장하는 API입니다.`;

//-- createPassword

export const getPasswordByDomainSuccMd = `🥳 비밀번호 조회를 성공하였습니다.`;
export const getPasswordByDomainDescriptionMd = `
### 💬 도메인의 비밀번호를 조회하는 API입니다.\n 
저장된 도메인이 없을 경우 \`404\` Error를 뱉어냅니다.
`;
export const getPasswordByDomainSummaryMd = `✅ Domain의 Password를 조회하는 API입니다.`;

//-- getPasswordByDomain

export const recommendPasswordSuccMd = `🥳 비밀번호 추천에 성공하였습니다.`;
export const recommendPasswordDescriptionMd = `
### 💬 원하는 무작위 비밀번호를 추천받는 API입니다.
구성되는 문자열은 아래와 같습니다.\n
1. 소문자 알파벳
2. 대문자 알파벳
3. 특수 문자(!@#$%^&*()_-+=<>?) 
4. 숫자(0~9)
`;
export const recommendPasswordSummaryMd = `✅ 원하는 길이의 무작위 비밀번호를 추천하는 API입니다.`;

//-- recommendPassword

export const getPasswordArrWithPaginationSuccMd = `🥳 비밀번호 pagination 조회에 성공했습니다 :).`;
export const getPasswordArrWithPaginationDescriptionMd = `
### 💬 비밀번호 개수를 원하는 페이지의 개수만큼 가져오는 API입니다..
반환되는 타입은 pagination 상태(정보)와 페이지네이션 된 정보입니다.
`;
export const getPasswordArrWithPaginationSummaryMd = `✅ 비밀번호를 페이지네이션하여 가져오는 API입니다.`;

//-- getPasswordArrWithPagination

export const deleteOneSuccMd = `🥳 비밀번호 단일 삭제에 성공했습니다. :).`;
export const deleteOneDescriptionMd = `
### 💬 비밀번호 하나를 삭제하는 API입니다.
삭제할 도메인의 비밀번호가 존재하지 않으면 \`404\` Error를 반환합니다.
`;
export const deleteOneSummaryMd = `✅ 비밀번호 단일 삭제 API입니다.`;

//-- deleteOne
