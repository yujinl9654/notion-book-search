# Book Search Screen Harness

## 범위

이 문서는 첫 도서 검색 화면에서 반드시 지켜야 하는 회귀 방지 기준을 정리합니다.

feature 문서보다 범위를 좁게 두며, 각 케이스는 미래 자동화 테스트로 옮기기 쉬울 만큼 구체적으로 작성합니다.

## 현재 검증 스냅샷

- 현재 구현은 React + TypeScript + Tailwind 기반의 목 검색 화면입니다.
- 수동 확인 기준으로 `idle`, `loading`, `success`, `empty`, `error` 상태를 한 화면에서 재현할 수 있습니다.
- 오류 상태는 `error`가 포함된 검색어로 재현합니다.
- 자동화 테스트는 아직 없으며, 현재 검증은 `pnpm lint`, `pnpm build`, `pnpm typecheck` 통과 및 수동 상태 확인 기준입니다.

## [BOOK-SEARCH-001] 초기 화면에 검색 수단이 보인다

- Priority: P1
- Purpose: 사용자가 화면에 들어오자마자 어떻게 검색을 시작하는지 알 수 있어야 합니다.
- Conditions: 아직 검색을 한 번도 실행하지 않은 초기 진입 상태입니다.
- Input / Action: 도서 검색 화면을 엽니다.
- Expected Result: 검색 입력창과 눈에 보이는 검색 실행 수단이 렌더링되고, 이 화면이 도서 검색용이라는 맥락이 드러납니다.
- Prohibited Result: 빈 컨테이너가 보이거나, 입력창이 없거나, 검색 화면인지 알 수 없는 상태로 진입합니다.
- Test Candidate: e2e

## [BOOK-SEARCH-002] 비어 있지 않은 검색어는 실제 검색을 시작한다

- Priority: P1
- Purpose: 의미 있는 검색어 입력이 실제 검색 흐름으로 이어져야 합니다.
- Conditions: 화면은 유휴 상태이고, 사용자는 공백이 아닌 문자를 하나 이상 입력했습니다.
- Input / Action: 기본 검색 실행 수단으로 검색어를 제출합니다.
- Expected Result: 화면이 로딩 상태로 전환되고, 제출한 검색어 기준으로 결과 요청이 시작됩니다.
- Prohibited Result: UI가 동작을 무시하거나, 유휴 상태에 머물거나, 두 번 이상 시도해야 로딩이 나타납니다.
- Test Candidate: integration

## [BOOK-SEARCH-003] 빈 문자열 또는 공백만 있는 검색어는 요청을 시작하지 않는다

- Priority: P1
- Purpose: 불필요한 요청과 혼란스러운 빈 검색을 막습니다.
- Conditions: 입력값이 빈 문자열이거나 공백만 포함합니다.
- Input / Action: 검색을 시도합니다.
- Expected Result: 요청이 시작되지 않고, 사용자는 같은 화면에서 바로 입력을 수정할 수 있습니다.
- Prohibited Result: 빈 검색어로 요청이 나가거나, 공백만 입력했는데 로딩 상태로 들어갑니다.
- Test Candidate: integration

## [BOOK-SEARCH-004] 요청 중에는 로딩 상태가 눈에 보여야 한다

- Priority: P1
- Purpose: 진행 중인 작업이 사용자에게 읽히도록 합니다.
- Conditions: 유효한 검색 요청이 시작되었고 아직 응답이 끝나지 않았습니다.
- Input / Action: 검색을 실행한 뒤 응답이 끝나기 전 화면을 확인합니다.
- Expected Result: 눈에 보이는 로딩 표시가 나타나고, 사용자는 결과를 기다리는 중임을 알 수 있습니다.
- Prohibited Result: 요청이 진행 중인데도 화면이 유휴 상태처럼 보이거나, 이미 끝난 상태 메시지가 남아 있습니다.
- Test Candidate: integration

## [BOOK-SEARCH-005] 성공 응답은 읽을 수 있는 결과 목록을 렌더링한다

- Priority: P1
- Purpose: 화면의 핵심 역할인 검색 결과 표시가 보장되어야 합니다.
- Conditions: 데이터 소스가 하나 이상의 도서 결과를 성공적으로 반환합니다.
- Input / Action: 검색을 완료합니다.
- Expected Result: 결과 목록이 렌더링되고, 각 항목에서 최소한 식별 가능한 제목이 보여야 합니다.
- Prohibited Result: 요청은 성공했는데 결과 영역이 비어 있거나, 목록이 무너지거나, 항목을 식별할 수 없습니다.
- Test Candidate: e2e

## [BOOK-SEARCH-006] 선택적 필드가 비어 있어도 결과 렌더링이 깨지지 않는다

- Priority: P1
- Purpose: 불완전한 메타데이터 때문에 UI 전체가 무너지지 않도록 합니다.
- Conditions: 성공 응답의 일부 항목에 썸네일, 출판사, 출간일 같은 선택적 필드가 없습니다.
- Input / Action: 해당 응답을 렌더링합니다.
- Expected Result: 결과 목록은 계속 렌더링되고, 비어 있는 선택적 필드는 자연스럽게 누락 처리됩니다.
- Prohibited Result: 목록이 크래시 나거나, 전체 결과가 사라지거나, 구현 세부가 그대로 새는 깨진 placeholder가 보입니다.
- Test Candidate: integration

## [BOOK-SEARCH-007] 결과가 0건이면 빈 결과 상태를 보여준다

- Priority: P1
- Purpose: 검색 실패와 단순 무결과 상태를 구분합니다.
- Conditions: 데이터 소스가 성공 응답을 반환했지만 결과 항목 수는 0건입니다.
- Input / Action: 검색을 완료합니다.
- Expected Result: 빈 결과 메시지가 명확하게 보이고, 사용자는 같은 화면에서 다시 검색할 수 있습니다.
- Prohibited Result: 결과 영역이 그냥 비어 있거나, 오류처럼 보이거나, 로딩이 끝나지 않은 상태로 남습니다.
- Test Candidate: e2e

## [BOOK-SEARCH-008] 실패 응답은 재시도 가능한 오류 상태를 보여준다

- Priority: P1
- Purpose: 실패가 사용자에게 보이고, 바로 회복 가능한 상태여야 합니다.
- Conditions: 검색 요청이 네트워크 또는 서비스 오류로 실패합니다.
- Input / Action: 오류 응답으로 요청을 종료합니다.
- Expected Result: 오류 메시지가 보이고, 사용자는 같은 검색어나 다른 검색어로 다시 시도할 수 있습니다.
- Prohibited Result: UI가 로딩에 멈추거나, 크래시 나거나, 오류 후에 검색 수단이 사라집니다.
- Test Candidate: e2e

## [BOOK-SEARCH-009] 새 검색은 이전 최종 상태를 덮어써야 한다

- Priority: P2
- Purpose: 이전 결과나 메시지가 새 검색 결과처럼 오해되지 않게 합니다.
- Conditions: 화면이 이미 성공, 빈 결과, 오류 중 하나의 상태를 한 번 거쳤습니다.
- Input / Action: 다른 유효한 검색어를 입력하고 다시 검색합니다.
- Expected Result: 새 요청이 현재 활성 상태를 가져가고, 최종적으로 최신 검색어 기준 결과로 해석되는 화면이 보여야 합니다.
- Prohibited Result: 새 요청이 끝난 뒤에도 이전 결과나 메시지가 최신 검색 결과처럼 남아 있습니다.
- Test Candidate: integration

## [BOOK-SEARCH-010] 어떤 최종 상태 뒤에도 다시 검색할 수 있어야 한다

- Priority: P1
- Purpose: 새로고침 없이 핵심 흐름을 반복할 수 있게 합니다.
- Conditions: 화면이 성공, 빈 결과, 오류 상태 중 하나에 있습니다.
- Input / Action: 검색어를 수정하고 다시 제출합니다.
- Expected Result: 페이지를 새로고침하지 않아도 다시 검색이 실행됩니다.
- Prohibited Result: 입력이나 버튼이 계속 비활성화되거나, 폼이 더 이상 동작하지 않거나, 새로고침만이 유일한 복구 수단이 됩니다.
- Test Candidate: e2e

## 첫 자동화 후보

코드가 생기면 아래 케이스부터 자동화하는 것을 권장합니다.

1. `BOOK-SEARCH-003` 입력 검증 integration 테스트
2. `BOOK-SEARCH-006` 결과 렌더링 복원력 integration 테스트
3. `BOOK-SEARCH-007` 빈 결과 흐름 e2e 테스트
4. `BOOK-SEARCH-008` 오류 복구 흐름 e2e 테스트
