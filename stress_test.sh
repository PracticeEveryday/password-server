#!/bin/bash

# 노드(Node.js) 설치 경로
node_path=$(which node)

if [ -n "$node_path" ]; then
  # 노드가 설치되어 있는 경우
  echo "Node.js가 설치되어 있습니다. 버전 정보: $(node -v)"
else
  # 노드가 설치되어 있지 않은 경우
  echo "Node.js가 설치되어 있지 않습니다. 먼저 Node.js를 설치해주세요."
fi

# 첫 번째 인자 입력 받기
echo "가상의 사용자 수를 입력해주세요"
read user_count

# 테스트할 횟수 인자 입력 받기
echo "요청 횟수를 입력해주세요"
read request_count

# URL 인자 입력 받기
echo "URL을 입력해주세요"
read url


echo "start stress test!"
npx artillery quick --count $user_count -n $request_count $url