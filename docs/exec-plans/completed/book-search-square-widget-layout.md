# Book Search Square Widget Layout Plan

## 목표

- 도서 검색 위젯을 고정된 정사각형 영역으로 표시합니다.
- 검색 input을 위젯 최상단에 배치하고, 위젯 내부 배경과 input 사이의 패딩을 제거합니다.
- 검색어가 없으면 input 아래 영역은 빈 공간으로 유지합니다.
- 검색 결과가 있으면 input 아래 고정 영역에 스크롤 가능한 결과 목록을 표시합니다.

## 입력 문서

- `docs/project-guide.md`
- `docs/product-specs/book-search-screen.md`
- `docs/harness/book-search-screen.md`
- `docs/harness/pre-commit-quality-gates.md`
- `docs/exec-plans/README.md`

## 범위

- 도서 검색 페이지 레이아웃 조정
- 검색 input과 결과 영역 구조 조정
- 관련 자동화 테스트 갱신
- product spec과 harness 문서 갱신

## 범위 밖

- 실제 도서 API 연동
- 결과 선택 액션
- Notion 저장 액션

## 구현 순서

1. 위젯 컨테이너를 고정 정사각형 레이아웃으로 변경합니다.
2. input을 위젯 최상단에 붙이고 내부 패딩을 제거합니다.
3. input 아래 결과 영역을 항상 렌더링하고, 결과가 있을 때만 스크롤 목록을 표시합니다.
4. 레이아웃과 자동 검색 테스트를 갱신합니다.
5. 필수 품질 게이트를 실행합니다.

## 검증

- [x] `pnpm lint`
- [x] `pnpm test`
- [x] `pnpm typecheck`
- [x] `pnpm build`

## 완료 조건

- input이 정사각형 위젯의 최상단에 위치합니다.
- 위젯 내부 배경과 input 사이의 패딩이 없습니다.
- 검색어가 없을 때 input 아래 영역은 빈 공간입니다.
- 검색 결과가 있을 때 input 하단 결과 영역은 스크롤 가능한 목록입니다.
- 관련 테스트와 문서가 현재 동작과 일치합니다.
