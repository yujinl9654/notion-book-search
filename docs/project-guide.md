# Project Guide

## 개요

이 저장소는 하네스 엔지니어링 방식으로 도서 검색 경험을 만드는 데 사용합니다.

처음부터 UI 코드를 바로 쓰는 대신, 먼저 아래 내용을 문서로 고정합니다.

- 도서 검색 화면이 반드시 해야 하는 일
- 화면이 지원해야 하는 상태
- 먼저 막아야 하는 회귀
- 첫 구현 범위에 포함할 최소 기능

이 구조는 2026년 2월 11일 공개된 OpenAI의 하네스 엔지니어링 글을 바탕으로 정했습니다.

- `AGENTS.md`는 짧고 안내 중심으로 유지합니다.
- 오래 유지할 지식은 구조화된 `docs/`에 저장합니다.
- 검증 루프와 기대 동작을 저장소 안에 명시합니다.
- 재사용할 규칙은 초기에 문서화해 드리프트를 줄입니다.

참고 문서:

- https://openai.com/ko-KR/index/harness-engineering/

## 현재 상태

- 저장소는 문서 부트스트랩 이후 첫 프론트엔드 구현을 시작했습니다.
- 프론트엔드는 `Vite + React + TypeScript` 조합으로 구성했습니다.
- 스타일링은 Tailwind CSS를 사용합니다.
- ESLint는 flat config 기반으로 TypeScript, React, Hooks, a11y, import order, Tailwind class order 규칙을 적용했습니다.
- 로컬 런타임 기준은 `nvm`의 Node `24.15.0`과 pnpm `10.21.0`입니다.
- 현재 검색 화면은 목 데이터로 동작합니다.
- Git 저장소는 초기화되었고 `origin`은 `https://github.com/yujinl9654/notion-book-search.git`로 연결되어 있습니다.
- 자동화 테스트는 아직 없지만 `pnpm lint`, `pnpm build`, `pnpm typecheck`를 기준 품질 게이트로 사용합니다.
- 현재 기준 문서는 여전히 `docs/`입니다.

## 제품 방향

첫 번째 제품 범위는 사용자가 책을 검색하고 결과를 확인할 수 있는 화면입니다.

첫 구현에 대한 현재 가정:

- 사용자는 키워드를 입력하고 검색을 실행할 수 있어야 합니다.
- 화면은 로딩, 성공, 빈 결과, 오류 상태를 지원해야 합니다.
- 검색 결과는 사람이 빠르게 훑을 수 있는 목록 형태여야 합니다.
- 첫 단계는 책을 찾는 흐름에 집중하고, 컬렉션 관리까지 확장하지 않습니다.

구현 전 다시 확인할 항목:

- 어떤 데이터 소스를 검색에 사용할지
- 이후 단계에서 Notion 저장 기능을 포함할지

## 첫 범위에서 제외할 항목

- 인증
- 페이지네이션 또는 무한 스크롤
- 정렬과 고급 필터
- Notion 저장 동작
- 모바일 네이티브 앱
- 로컬 개발 범위를 넘는 관측 가능성 체계

## 문서 맵

- `docs/product-specs/book-search-screen.md`: 첫 화면의 요구사항과 상태 정의
- `docs/harness/book-search-screen.md`: 첫 화면의 회귀 방지 기준
- `docs/exec-plans/active/book-search-screen-bootstrap.md`: 첫 구현 작업 순서

## 문서 운영 규칙

- 제품 의도는 feature 문서에 둡니다.
- 회귀 보장은 harness 문서에 둡니다.
- 구현 순서는 exec plan 문서에 둡니다.
- 동작이 바뀌면 같은 턴에 feature 문서와 harness 문서를 함께 갱신합니다.
- 실제 코드가 생기기 전에는 구현 경로를 문서에 추가하지 않습니다.

## 현재 구현 기준

- 앱 엔트리: `src/app/main.tsx`
- 앱 셸: `src/app/App.tsx`
- 도서 검색 페이지: `src/pages/book-search/`
- 검색 실행 UI: `src/features/book-search/`
- 도서 엔티티 UI, 타입, 목 검색 API: `src/entities/book/`
- 스타일 진입점: `src/index.css`
- TypeScript 설정: `tsconfig.json`
- Node 버전 고정: `.nvmrc`
- 패키지 매니저: `pnpm`
- 패키지 lockfile: `pnpm-lock.yaml`
- GitHub 원격: `origin`
