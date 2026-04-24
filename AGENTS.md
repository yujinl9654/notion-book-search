# AGENTS.md

이 저장소는 문서 우선 하네스 엔지니어링 방식으로 시작합니다.

작업 전 읽기 순서:

1. `docs/project-guide.md`에서 현재 목표와 가정을 확인합니다.
2. `docs/harness/overview.md`에서 문서 흐름과 검증 기준을 확인합니다.
3. 해당 기능의 `docs/product-specs/` 문서를 읽습니다.
4. 해당 기능의 `docs/harness/` 문서를 읽습니다.
5. 구현을 시작할 때는 `docs/exec-plans/active/` 문서를 따릅니다.

저장소 맵:

- `docs/project-guide.md`: 저장소 목적, 범위, 현재 가정
- `docs/product-specs/`: 기능 요구사항과 화면 동작
- `docs/harness/`: 회귀 방지 기준과 테스트 후보
- `docs/exec-plans/active/`: 바로 실행할 구현 계획

작업 원칙:

- 이 파일은 길게 쓰지 않습니다. 백과사전이 아니라 맵입니다.
- 제품 의도와 회귀 보장 기준의 원본은 `docs/`에 둡니다.
- 동작이 바뀌면 feature 문서와 harness 문서를 함께 갱신합니다.
- 코드가 생기기 전에는 구현 파일 경로를 추측해서 문서에 적지 않습니다.
- 넓고 모호한 설명보다 작고 검증 가능한 동작을 우선합니다.

현재 제품 초점:

- 첫 대상은 도서 검색 화면입니다.
- 첫 목표는 구현 전에 화면 상태와 회귀 방지 기준을 명확히 정의하는 것입니다.
- 현재 상태는 `Vite + React + TypeScript + Tailwind CSS` 기반의 첫 화면이 목 데이터로 동작하는 단계입니다.
- 로컬 Node 기준 버전은 `.nvmrc`의 `24.15.0`입니다.
