# Book Search Terminal Search UI Plan

## 목표

- 도서 검색 위젯을 첨부된 참고 이미지처럼 터미널형 검색 UI로 변경합니다.
- 기존 자동 검색, 결과 렌더링, 빈 결과, 오류 상태 흐름은 유지합니다.

## 입력 문서

- `docs/project-guide.md`
- `docs/product-specs/book-search-screen.md`
- `docs/harness/book-search-screen.md`
- `docs/harness/pre-commit-quality-gates.md`
- `docs/exec-plans/README.md`

## 범위

- 검색 패널을 상단 타이틀 바와 프롬프트 입력줄 구조로 변경합니다.
- 위젯 외곽을 얇은 라운드 테두리의 터미널형 프레임으로 변경합니다.
- 초기 화면 테스트를 새 시각 구조에 맞게 갱신합니다.
- 변경된 사용자 가시 동작을 product spec과 harness 문서에 반영합니다.

## 범위 밖

- 실제 도서 API 연동
- 검색 정확히 일치 옵션의 실제 필터 동작
- Notion 저장 액션
- 페이지네이션 또는 고급 필터

## 구현 순서

1. 문서 기준과 현재 검색 화면 구조를 확인합니다.
2. `SearchPanel`을 터미널형 상단 바와 프롬프트 입력줄로 변경합니다.
3. `BookSearchPage` 프레임과 결과 영역 스타일을 새 구조에 맞춥니다.
4. 초기 렌더링 테스트를 새 UI 구조에 맞게 갱신합니다.
5. product spec과 harness 문서를 현재 동작과 맞춥니다.
6. 필수 품질 게이트와 브라우저 수동 확인을 실행합니다.

## 검증

- [x] `pnpm lint`
- [x] `pnpm test`
- [x] `pnpm typecheck`
- [x] `pnpm build`
- [x] 브라우저에서 초기 화면과 검색 결과 렌더링 확인

## 완료 조건

- 사용자에게 보이는 검색 UI가 터미널형 프레임, 타이틀 바, 프롬프트 입력줄 구조로 보입니다.
- 기존 자동 검색 흐름이 유지됩니다.
- 관련 product spec과 harness 문서가 현재 동작과 일치합니다.
- 초기 렌더링 테스트가 새 UI 구조를 검증합니다.
- 필수 품질 게이트가 모두 통과합니다.

## 작업 메모

- 작업 시작 전에 이 active plan을 만들지 못했고, 사용자 지적 후 보정했습니다.
- 현재 변경분은 아직 커밋되지 않았으므로 completed로 이동하지 않습니다.
