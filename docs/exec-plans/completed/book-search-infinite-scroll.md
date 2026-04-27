# Book Search Infinite Scroll Exec Plan

## 목표

검색 결과 목록의 스크롤이 끝에 도달하면 Naver 책 검색 API의 다음 `start` 위치로 추가 결과를 요청하고, 기존 결과 아래에 이어 붙인다.

## 기준 문서

- `docs/project-guide.md`
- `docs/product-specs/book-search-screen.md`
- `docs/harness/book-search-screen.md`

## 완료 내용

1. Naver 책 검색 API 응답에서 `total`, `display`, `start`를 읽어 다음 페이지 시작 위치를 계산했다.
2. 검색 결과 영역이 하단에 가까워지면 다음 페이지를 요청하도록 스크롤 핸들러를 추가했다.
3. 추가 페이지 로딩 중에는 기존 목록을 유지하고 하단 로딩 메시지를 표시한다.
4. 다음 페이지 요청 실패 시 기존 목록은 유지하고 하단 오류 메시지를 표시한다.
5. 첫 검색, 빈 검색어, 빈 결과, 오류, 다음 페이지 로딩 동작을 자동화 테스트로 갱신했다.
