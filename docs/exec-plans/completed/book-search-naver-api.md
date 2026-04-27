# Book Search Naver API Exec Plan

## 목표

도서 검색 화면의 데이터 소스를 목 데이터에서 Naver 책 검색 API로 바꾸고, API 인증 정보가 Git 저장소에 저장되지 않도록 로컬 환경 변수로 분리한다.

## 기준 문서

- `docs/project-guide.md`
- `docs/product-specs/book-search-screen.md`
- `docs/harness/book-search-screen.md`
- `docs/harness/pre-commit-quality-gates.md`

## 작업 순서

1. Naver 책 검색 API의 요청/응답 필드를 현재 `Book` 모델에 맞게 매핑한다.
2. 브라우저 코드가 직접 클라이언트 시크릿을 들고 있지 않도록 Vite dev proxy에서 인증 헤더를 주입한다.
3. `.env.local`을 Git 추적 대상에서 제외하고, 필요한 변수 이름만 예시 파일로 남긴다.
4. 실제 API 응답, 빈 결과, 오류 응답을 테스트로 검증한다.
5. feature/harness 문서를 실제 API 기준으로 갱신한다.
6. `pnpm lint`, `pnpm test`, `pnpm typecheck`, `pnpm build`로 검증한다.
