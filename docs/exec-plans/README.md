# Exec Plans

## 목적

이 문서는 기능 작업을 시작할 때 실행 계획 문서를 만들고, 작업 완료 후 계획 문서를 보관하는 규칙을 정의합니다.

기준 문서:

- `docs/project-guide.md`
- `docs/harness/overview.md`
- `docs/harness/pre-commit-quality-gates.md`

## 디렉터리 역할

- `docs/exec-plans/active/`: 아직 진행 중이거나 아직 완료 처리되지 않은 기능 작업 계획
- `docs/exec-plans/completed/`: 구현, 검증, commit 또는 `develop` 머지가 끝난 기능 작업 계획 보관소

## 기능 작업 시작 규칙

사용자가 새 기능, 동작 변경, UI 변경, API 연동, 테스트 도입 같은 구현 작업을 요청하면 작업 시작 전에 `docs/exec-plans/active/` 아래에 실행 계획 문서를 만듭니다.

예시 파일명:

- `docs/exec-plans/active/book-search-auto-search.md`
- `docs/exec-plans/active/notion-save-action.md`

파일명은 아래 기준을 따릅니다.

- 소문자 kebab-case를 사용합니다.
- 기능 또는 변경 범위가 드러나야 합니다.
- 날짜보다 기능명을 우선합니다.

## Active Plan 템플릿

새 active plan은 아래 구조를 기본으로 사용합니다.

```md
# [Feature Name] Plan

## 목표

- 이번 작업으로 달라져야 하는 사용자 또는 시스템 동작을 적습니다.

## 입력 문서

- `docs/project-guide.md`
- `docs/product-specs/...`
- `docs/harness/...`
- `docs/harness/pre-commit-quality-gates.md`

## 범위

- 이번 작업에 포함할 항목을 적습니다.

## 범위 밖

- 이번 작업에 포함하지 않을 항목을 적습니다.

## 구현 순서

1. 문서 기준을 확인합니다.
2. 구현을 진행합니다.
3. 테스트를 추가하거나 갱신합니다.
4. 필수 품질 게이트를 실행합니다.
5. 결과를 문서에 반영합니다.

## 검증

- [ ] `pnpm lint`
- [ ] `pnpm test`
- [ ] `pnpm typecheck`
- [ ] `pnpm build`

## 완료 조건

- 사용자에게 보이는 동작이 목표와 일치합니다.
- 관련 product spec과 harness 문서가 현재 동작과 일치합니다.
- 기능 변경이 있으면 자동화 테스트가 추가되거나 갱신됩니다.
- 필수 품질 게이트가 모두 통과합니다.
```

## 완료 처리 규칙

active plan은 아래 조건 중 하나가 충족되면 `docs/exec-plans/completed/`로 이동합니다.

- 해당 작업 변경분이 커밋되었습니다.
- 해당 작업 변경분이 `develop` 브랜치에 머지되었습니다.

이동할 때는 파일명을 유지합니다.

예:

```sh
git mv docs/exec-plans/active/book-search-auto-search.md docs/exec-plans/completed/book-search-auto-search.md
```

## 완료 전 체크리스트

completed로 이동하기 전에 아래를 확인합니다.

- [ ] active plan의 완료 조건이 현재 작업 결과와 맞습니다.
- [ ] `docs/harness/pre-commit-quality-gates.md`의 필수 게이트가 통과했습니다.
- [ ] 기능 변경이 있으면 관련 테스트가 추가되거나 갱신되었습니다.
- [ ] product spec과 harness 문서가 현재 동작과 맞습니다.
- [ ] 커밋이 생성되었거나 `develop`에 머지되었습니다.

## 운영 메모

- active plan은 작업 중인 의사결정과 검증 상태를 작게 유지하는 문서입니다.
- completed plan은 과거 작업의 실행 기록입니다.
- 완료된 plan을 다시 수정해야 할 정도로 새 작업이 생기면, completed 문서를 되살리기보다 새 active plan을 만듭니다.
