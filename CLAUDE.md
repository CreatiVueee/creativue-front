@AGENTS.md

# CreatiVue Frontend — 현재 코드 구조

이 문서는 `creativue-front` Next.js 프로젝트의 **실제 구현 상태**를 기준으로 작성되었다.
(상위 디렉토리의 `../CLAUDE.md`는 프로젝트 착수 전 기획 단계 문서라 지금은 상당 부분 stale함 — 실제 작업은 이 문서 기준으로 판단할 것.)

---

## 진행 현황

`IMPLEMENTATION_PLAN.md` 기준 Phase 0~6 + Phase DB 완료, Phase 7~9는 미착수.

| Phase | 내용 | 상태 |
|---|---|---|
| 0~3 | 세팅, 공통 레이아웃/인증 UI, 회원가입 UI, 랜딩 | ✅ 완료 |
| 4 | 브랜드 리뷰 5단계 | ✅ 완료 |
| 5 | 클라이언트 프로필 + 공모전 등록 | ✅ 완료 |
| 6 | 공모전 목록 + 상세 | ✅ 완료 |
| DB | Supabase 인프라 연동 | ✅ 완료 (아래 "Supabase 연동 현황" 참고) |
| 7 | 전문가 목록 + 예약 (`expert-booking/`) | 🚧 라우트만 존재, placeholder |
| 8 | 전문가 스케줄 관리 (`expert-schedule/`) | ❌ 미착수 (빈 디렉토리) |
| 9 | PreVue(`prevue/`), Partners 본문, 반응형 점검 | ❌ 미착수 |

---

## 기술 스택 (실제 설치 버전)

- **Next.js 16.2.6**, App Router, TypeScript — ⚠️ `AGENTS.md` 참고: 이 버전은 학습 데이터의 관례와 다른 breaking change가 있을 수 있으므로 API 확신이 없으면 `node_modules/next/dist/docs/`를 먼저 확인
- **React 19.2.4**
- **Tailwind CSS v4** — `tailwind.config.ts` 없음, `app/globals.css`의 `@theme inline`으로 처리
- **Zustand v5** — 전역 상태 (auth, login modal, brand review)
- **TanStack Query v5** (+ devtools)
- **react-hook-form + zod v4** (`@hookform/resolvers`)
- **motion v12** — import는 `motion/react`
- **lucide-react**, **sonner**(toast), **date-fns**, **swiper**
- **Supabase**: `@supabase/supabase-js` + `@supabase/ssr`

---

## 디렉토리 구조 (실제)

```
app/
  layout.tsx, providers.tsx        ← Root layout, QueryClientProvider + AuthInitializer
  (main)/
    layout.tsx                     ← Header + children + Footer + LoginModal
    page.tsx                       ← 랜딩 (Hero + Problem 캐러셀 + 공모전 그리드 + Why + Footer)
    login/                         ← 로그인 페이지
    client-signup/                 ← 클라이언트 가입
    freelancer-signup/             ← 프리랜서 가입 (전문가/창작자 역할 분기)
    brand-review/                  ← 브랜드 리뷰 5단계 폼 (_components/steps/Step1~5)
    client-profile/                ← 클라이언트 프로필 (Hero + 아코디언 + 사이드바)
    projects/
      page.tsx                     ← 공모전 목록 (필터/검색/정렬)
      [id]/page.tsx                ← 공모전 상세 (갤러리, 지원하기)
      create/page.tsx              ← 공모전 등록 (brands + projects INSERT)
    expert-booking/                ← 🚧 placeholder만 존재
    expert-schedule/                ← ❌ 빈 디렉토리
    partners/                      ← 🚧 placeholder만 존재
    prevue/                        ← ❌ 빈 디렉토리
data/                              ← TS 더미 데이터 + Supabase 타입
  contests.ts, contestsDB.ts, experts.ts, carousel.ts
  supabase.ts                      ← Database 타입 (실제 DB 스키마 기준, 수동 관리 중 — 아래 참고)
features/
  auth/
    store/  authStore.ts, brandReviewStore.ts, loginModalStore.ts
    ui/     LoginModal.tsx, SignupSuccessModal.tsx, BrandReviewCompleteModal.tsx
  contests/
    hooks/  useLatestContests.ts
    ui/     ContestCard.tsx
shared/
  components/  Header.tsx, Footer.tsx, ui/(ChipButton, FileDropzone, PasswordInput)
  hooks/       useInterval.ts
  lib/
    supabase/  client.ts, server.ts, queries.ts
    utils/     date.ts (calcDday 등)
  types/       index.ts
```

---

## 라우팅 테이블

| 경로 | 상태 | 비고 |
|---|---|---|
| `/` | ✅ | 랜딩 |
| `/login` | ✅ | 실제/Mock 겸용 로그인 |
| `/client-signup`, `/freelancer-signup` | ✅ | 실제/Mock 겸용 가입 |
| `/brand-review` | ✅ | 로그인 필요 (헤더에서 미로그인 시 모달) |
| `/client-profile` | ✅ | |
| `/projects`, `/projects/[id]`, `/projects/create` | ✅ | |
| `/expert-booking`, `/expert-booking/[id]` | 🚧 | Phase 7, 미구현 |
| `/expert-schedule` | ❌ | Phase 8, 미구현 |
| `/partners` | 🚧 | Phase 9, 미구현 |
| `/prevue` | ❌ | Phase 9, 미구현 |

---

## 인증 — 실제 Supabase / Mock 듀얼 모드

`.env.local`의 `NEXT_PUBLIC_USE_MOCK_AUTH` 플래그로 전환한다 (`features/auth/store/authStore.ts`의 `IS_MOCK_AUTH`).

- **`true` (현재 기본값)**: 로그인/회원가입이 실제 Supabase를 호출하지 않고 즉시 로그인 상태로 전환됨. 로그인 시 이메일에 `freelancer`가 포함되면 프리랜서, 아니면 클라이언트로 간주. Zustand `persist`(localStorage: `auth-storage-mock`)로 새로고침 후에도 유지. `app/providers.tsx`의 `AuthInitializer`는 이 모드에서 Supabase 세션 복원 로직을 완전히 스킵한다.
- **`false`/미설정**: 실제 `supabase.auth.signInWithPassword` / `signUp` / `signOut` 사용. `AuthInitializer`가 `getSession()` + `onAuthStateChange()`로 새로고침·탭 전환 후에도 세션 복원.
- 실제 모드로 되돌릴 때는 `.env.local`에서 해당 줄만 지우거나 `false`로 바꾸면 코드 변경 없이 즉시 전환된다.
- 로그인/가입 폼(`LoginModal.tsx`, `login/page.tsx`, `client-signup`/`freelancer-signup` `page.tsx`)은 플래그를 직접 참조하지 않고 `authStore`의 `login()`/`setAuth()`만 호출 — 분기 로직은 store와 각 signup 페이지의 `handleSubmit` 내부에만 있음.

---

## Supabase 연동 현황 — 실제 스키마 (중요, 타입 생성기 없이 수동 관리 중)

`data/supabase.ts`는 자동 생성 파일이 아니라 실제 DB 스키마를 보고 **수동으로 맞춘 타입**이다. DB 쪽 컬럼이 바뀌면 이 파일과 `shared/lib/supabase/queries.ts`가 즉시 깨지므로, 스키마 변경 시 항상 함께 갱신할 것.

**핵심 설계: `clients.id` / `freelancers.id` / `user_profiles.id`는 전부 `auth.users.id`(UUID)와 동일한 값이다.** 별도의 `user_id` FK 컬럼은 존재하지 않는다 — 프로필 테이블의 PK 자체가 Auth 유저 UUID다. 회원가입 시 반드시 `id: authUser.id`를 명시적으로 넣어야 한다 (auto-increment 아님).

- `user_profiles` (❌ `users` 아님): `id`(uuid, = auth uid), `user_id`(text, nullable — 클라이언트가 입력한 "아이디"/로그인용 표시 문자열, 프리랜서는 미사용), `email`, `phone_number`, `user_type`
- `clients`: `id`(uuid), `interested_fields`(text[])
- `freelancers`: `id`(uuid), `nickname`, `profile_url`, `role`, `main_expertise`, `experience_years`, `certification_urls`
- `brands.client_id`, `project_applicants.freelancer_id`, `project_submissions.freelancer_id`: 전부 uuid (number 아님)
- `project_submissions.portfolio_file_urls`: 배열 (단수 `portfolio_file_url` 아님)

**RLS 미설정 구간**: `projects`/`brands` SELECT가 RLS 정책 부재로 막혀 있어, 목록/상세 조회는 `data/contestsDB.ts`(`ProjectWithBrand[]` 더미)를 사용 중이다 (`useLatestContests.ts`, `useContestFilters.ts`, `projects/[id]/page.tsx`에 `⏳ DB 연동 시 아래 주석 해제` 마커 있음). INSERT 경로(`insertBrand`, `insertProject`, `insertProjectApplicant`)는 실제 DB에 연결되어 있다.

`shared/lib/supabase/queries.ts`의 조회 함수는 에러를 삼키지 않고 `PGRST116`(행 없음, 정상 케이스)을 제외한 에러를 `console.error`로 남긴다 — 로그인 후 상태가 이상하면 가장 먼저 브라우저 콘솔을 확인할 것.

---

## 브랜드 디자인 토큰 (고정값 — 변경 금지)

- **폰트**: 나눔스퀘어라운드, `app/globals.css`에 jsDelivr CDN `@font-face`로 선언 (`next/font` 미사용)
- **그라디언트**: `linear-gradient(135deg, #F3B0F2 0%, #B26EFD 55%, #93B5F6 100%)`
  - `--brand-pink: #F3B0F2`, `--brand-purple: #B26EFD`, `--brand-blue: #93B5F6`
- 로그인/가입 페이지 최소 높이는 `min-h-[calc(100vh-68px)]` (헤더 높이 제외) — `min-h-screen` 금지

---

## 더미 데이터 규칙

- `data/` 폴더에 TypeScript 파일로 작성 (`.json` 아님)
- 공모전: `image`, `hot`, `aiAllowed`, `applicants`(숫자), `deadline`(ISO 문자열) — `dday`는 저장하지 않고 `calcDday(deadline)`로 런타임 계산
- 전문가: `photo`, `nickname`, `title`, `reviews`(숫자)

---

## 참고 파일 (figma_markup 레퍼런스)

Phase 7~9(전문가 예약/스케줄, PreVue) 구현 시 `../figma_markup/src/app/pages/ExpertList.tsx`, `ExpertBooking.tsx`, `ExpertSchedule.tsx`, `PreVue.tsx`를 참고할 것. 상세 매핑은 `../IMPLEMENTATION_PLAN.md`의 Phase 7~9 섹션 참고.
