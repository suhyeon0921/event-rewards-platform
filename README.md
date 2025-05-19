# 이벤트 보상 시스템 (Event Rewards Platform)

NestJS + MSA(Microservice Architecture) + MongoDB 기반으로 구축된 이벤트 보상 시스템입니다.
사용자가 각종 이벤트에 참여하고 조건을 달성하면 보상을 받을 수 있는 플랫폼입니다.

## 시스템 구조

시스템은 3개의 마이크로서비스로 구성되어 있습니다:
- **Auth 서비스**: 사용자 인증 및
 관리
- **Event 서비스**: 이벤트와 보상 관리
- **Gateway 서비스**: API 게이트웨이 기능

## 실행 방법

### 개발 환경
```bash
docker compose --env-file .env.dev up --build mongodb
```

### 프로덕션 환경
```bash
docker compose --env-file .env.prod up --build mongodb
```

## 게임 컨셉

플레이어는 다양한 직업을 선택하여 몬스터를 사냥하고, 퀘스트를 완료하며, 레벨을 올리고, 아이템을 수집할 수 있습니다.

### 핵심 요소:
- **캐릭터 직업**: 전사, 마법사, 궁수
- **레벨 시스템**: 최대 100레벨
- **장비 시스템**: 무기, 방어구, 액세서리
- **몬스터**: 일반 몬스터와 보스 몬스터
- **퀘스트 시스템**: 다양한 퀘스트 수행
- **게임 내 화폐**: 코인
- **길드 시스템**: 길드 가입 및 활동
- **친구 시스템**: 친구 추가 및 상호작용

## 사용자 역할

| 역할 | 권한 설명 |
|------|-----------|
| USER | 보상 요청 가능 |
| OPERATOR | Event와 Reward 생성/수정/삭제 |
| AUDITOR | 모든 보상 변경 로그 읽기 가능 |
| ADMIN | 모든 기능에 접근 가능 |

## 인증

JWT 기반 토큰 인증을 사용합니다. 초기에는 accessToken, refreshToken 방식을 도입하려 했으나, 현재는 단순화된 JWT 인증을 사용합니다.

## 주요 이벤트

### 매일 출석체크 보상
- 매일 출석체크 시, 코인 100개 지급

### 출석 챌린지 (Attendance Challenge)
- **이벤트 기간**: 2025-05-20 ~ 2025-06-20 (1개월)
- **세부 조건**: 7일 연속 로그인 (하루라도 놓치면 카운트 초기화)
- **보상**: 매일 코인 100개

### 여름 의상 콘테스트 (Summer Fashion Contest)
- 검증 로직 미완성 상태입니다.
- **이벤트 기간**: 2025-06-15 ~ 2025-07-15 (1개월)
- **제출 기간**: 2025-06-15 ~ 2025-07-05
- **투표 기간**: 2025-07-06 ~ 2025-07-15
- **세부 조건**: '좋아요' 투표로 순위 결정
- **보상**:
  - 상위 10위: '여름의 왕관' + 코인 1,000개
  - 참가자 전원: '여름 기념' 타이틀 + 코인 300개

## API 구조

### Auth 서비스 API

| 엔드포인트 | 메소드 | 설명 |
|------------|--------|------|
| /api/v1/auth/signup | POST | 회원가입 |
| /api/v1/auth/login | POST | 로그인 |

### Event 서비스 API

| 엔드포인트 | 메소드 | 설명 |
|------------|--------|------|
| /api/v1/events | GET | 모든 이벤트 조회 |
| /api/v1/events | POST | 새 이벤트 생성 |
| /api/v1/events/:name | GET | 특정 이벤트 조회 |
| /api/v1/events/:name | PUT | 이벤트 수정 |
| /api/v1/events/:name | DELETE | 이벤트 삭제 |
| /api/v1/attendance | POST | 사용자 출석 체크 |
| /api/v1/attendance/admin | POST | 관리자용 출석 설정 |
| /api/v1/rewards | GET | 모든 보상 조회 |
| /api/v1/rewards/events/:eventName | GET | 이벤트별 보상 조회 |
| /api/v1/rewards/events/:eventName | POST | 이벤트에 보상 추가 |
| /api/v1/rewards/received | GET | 지급된 보상 로그 조회 |
| /api/v1/rewards/users/requests | POST | 사용자 보상 요청 |
| /api/v1/rewards/users/requests | GET | 사용자 보상 요청 내역 조회 |

### Gateway 서비스 API

| 엔드포인트 | 메소드 | 설명 |
|------------|--------|------|
| /api/v1/proxy/auth/* | ALL | Auth 서비스로 라우팅 |
| /api/v1/proxy/events/* | ALL | Event 서비스(이벤트 관련)로 라우팅 |
| /api/v1/proxy/rewards/events/* | ALL | Event 서비스(보상 관련)로 라우팅 |
| /api/v1/proxy/attendance/admin | ALL | Event 서비스(관리자 출석 관련)로 라우팅 |
| /api/v1/proxy/reward/user/* | ALL | Event 서비스(사용자 보상 관련)로 라우팅 |
| /api/v1/proxy/attendance | ALL | Event 서비스(출석 관련)로 라우팅 |
| /api/v1/proxy/rewards/received | ALL | Event 서비스(보상 로그 관련)로 라우팅 |

## 공통 모듈 (Common)

각 서비스 간에 공유되는 코드를 포함합니다:
- 유저 역할 (UserRole) 열거형
- 공통 DTO 클래스 
- 유틸리티 함수
- 공통 인터페이스
