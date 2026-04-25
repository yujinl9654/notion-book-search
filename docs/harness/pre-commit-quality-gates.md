# Pre-Commit Quality Gates

## 목적

이 문서는 커밋 전에 반드시 거쳐야 하는 검증 명령과 판단 기준을 고정합니다.

기준 문서:

- `docs/project-guide.md`
- `docs/harness/overview.md`
- `docs/harness/book-search-screen.md`
- `docs/exec-plans/README.md`
- `docs/exec-plans/active/book-search-screen-bootstrap.md`

## 기본 원칙

- 커밋 전에는 아래 필수 게이트를 모두 통과해야 합니다.
- 사용자에게 보이는 기능이 추가되거나 바뀌면 해당 동작을 보호하는 테스트를 같은 변경 안에 추가하거나 갱신합니다.
- 테스트를 작성하지 못한 경우에는 이유와 남은 테스트 후보를 해당 harness 문서에 명시합니다.
- 문서만 바꾸는 경우에도 문서 변경이 기존 테스트/빌드 기준과 충돌하지 않는지 필수 게이트를 실행합니다.
- 기능 작업의 실행 계획은 `docs/exec-plans/README.md`에 따라 active에서 시작하고, 커밋 또는 `develop` 머지 후 completed로 이동합니다.

## 필수 게이트

아래 순서로 실행합니다.

```sh
pnpm lint
pnpm test
pnpm typecheck
pnpm build
```

각 명령의 역할:

| 명령 | 목적 | 실패 시 처리 |
| --- | --- | --- |
| `pnpm lint` | ESLint 규칙, import order, React/a11y/Tailwind 규칙 확인 | 코드나 설정을 수정한 뒤 다시 실행 |
| `pnpm test` | Vitest + Testing Library 기반 자동화 회귀 테스트 확인 | 실패한 테스트가 보호하는 동작을 확인하고 코드 또는 테스트를 수정 |
| `pnpm typecheck` | TypeScript 타입 계약 확인 | 타입 오류를 수정하고 관련 테스트를 다시 확인 |
| `pnpm build` | Vite production build 가능 여부 확인 | 빌드 오류와 번들 설정 오류를 수정 |

## 기능 변경 시 추가 기준

기능 동작이 추가되거나 바뀌면 아래를 함께 확인합니다.

1. 해당 feature 문서의 수용 조건이 현재 동작과 맞는지 확인합니다.
2. 해당 harness 문서의 회귀 방지 케이스가 현재 동작과 맞는지 확인합니다.
3. 새 동작 또는 바뀐 동작을 검증하는 자동화 테스트를 추가하거나 갱신합니다.
4. 테스트가 생긴 경우 harness 문서의 자동화 상태 또는 자동화된 케이스 목록을 갱신합니다.

## 현재 테스트 기준

현재 자동화 테스트는 React 컴포넌트 상호작용을 `Vitest + Testing Library + jsdom`으로 검증합니다.

- 테스트 명령: `pnpm test`
- 테스트 셋업: `src/test/setup.ts`
- 도서 검색 위젯 테스트: `src/pages/book-search/ui/BookSearchPage.test.tsx`

시간 기반 동작 기준:

- debounce, 지연 응답, 재시도 같은 시간 기반 동작은 fake timer로 시간을 명시적으로 제어합니다.
- 테스트는 실제 사용자가 관찰하는 입력, 로딩, 결과, 빈 결과, 오류 상태를 우선 검증합니다.

## 커밋 전 체크리스트

- [ ] `pnpm lint` 통과
- [ ] `pnpm test` 통과
- [ ] `pnpm typecheck` 통과
- [ ] `pnpm build` 통과
- [ ] 사용자에게 보이는 동작이 바뀐 경우 product spec 갱신
- [ ] 회귀 방지 기준이 바뀐 경우 harness 문서 갱신
- [ ] 기능 변경이 있는 경우 관련 테스트 추가 또는 갱신
- [ ] 테스트를 추가하지 못한 경우 harness 문서에 이유와 남은 후보 기록
- [ ] 기능 작업이 커밋되거나 `develop`에 머지되는 경우 active exec plan을 completed로 이동
