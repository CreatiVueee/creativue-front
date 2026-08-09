# CollectiVue 인증(Auth) API 연동 가이드

이 문서는 프론트엔드 개발자가 Supabase Auth와 Zustand Store를 사용하여 회원가입, 로그인, 로그아웃 및 로그인 세션을 유지하는 방법을 설명합니다.

---

## 1. Zustand Store 개요 (`useAuthStore`)

인증 상태는 전역 상태 관리 라이브러리인 **Zustand**를 통해 관리됩니다. 로컬 스토리지(`localStorage`)에 저장되도록 설정되어 있어, 기본적으로 로그인 정보가 브라우저에 캐싱됩니다.

* **가져오기 (Import Path)**: `@/features/auth/store/authStore`
* **사용 가능한 주요 상태(State)**:
  * `user`: 현재 로그인한 사용자 객체 (`null`인 경우 비로그인 상태)
  * `isLoggedIn`: 로그인 여부 (`boolean`)
  * `isLoading`: API 요청 진행 여부 (`boolean` - 로딩 스피너 제어용)

### User 객체 규격 (`User` Interface)
```typescript
export interface User {
  id: string;        // Supabase Auth가 생성한 고유 UUID (PK)
  email: string;     // 사용자 이메일
  user_id: string;   // 사용자 가입 ID (닉네임이나 수동 입력 ID)
  user_type: "client" | "freelancer" | "admin"; // 역할군
  name: string;      // UI 호환용 이름 필드 (닉네임 또는 가입 ID)
}
```

---

## 2. 로그인 API (`login`)

사용자가 입력한 이메일과 비밀번호로 Supabase Auth에 로그인을 시도합니다. 로그인 성공 시 전역 `user` 상태와 `isLoggedIn`이 자동으로 세팅됩니다.

* **함수 시그니처**: `login: (email: string, password: string) => Promise<void>`

### 💻 연동 코드 예시 (`app/(main)/login/page.tsx`)
```tsx
import { useState } from "react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // 💡 Supabase 실제 로그인 API 호출
      await login(email, password);
      
      // 로그인 성공 시 메인 대시보드 또는 프로필 페이지로 이동
      router.push("/client-profile"); 
    } catch (err: any) {
      setError(err.message || "이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "로그인 중..." : "로그인"}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
```

---

## 3. 회원가입 API (`signUp`)

Supabase Auth에 계정을 생성하며, 역할군(`role`)에 따라 적절한 데이터베이스 프로필 테이블(`user_profiles` + `clients`/`freelancers`)에 데이터를 동시에 삽입합니다.

* **함수 시그니처**: 
  ```typescript
  signUp: (
    email: string,
    password: string,
    userId: string,
    role: "client" | "freelancer" | "admin",
    extra?: {
      phone?: string;
      interestedFields?: string[]; // client 전용
      nickname?: string;          // freelancer 전용
      profileUrl?: string;        // freelancer 전용
      role?: string;              // freelancer 전용 (기본값 'designer')
      mainExpertise?: string[];   // freelancer 전용
      experienceYears?: string;   // freelancer 전용
    }
  ) => Promise<void>
  ```

### 💻 클라이언트 가입 연동 예시 (`app/(main)/client-signup/page.tsx`)
```tsx
const { signUp, isLoading } = useAuthStore();

const handleSignupSubmit = async () => {
  try {
    await signUp(email, password, userId, "client", {
      phone: phone, // 연락처 전달
      interestedFields: selectedServices, // 관심 분야 목록 (예: ['logo', 'digital_ad'])
    });
    
    // 회원가입 성공 처리 (성공 모달 띄우기 또는 완료 페이지 이동)
    setShowModal(true);
  } catch (err: any) {
    alert(err.message || "회원가입 처리 중 오류가 발생했습니다.");
  }
};
```

### 💻 프리랜서 가입 연동 예시 (`app/(main)/freelancer-signup/page.tsx`)
```tsx
const { signUp, isLoading } = useAuthStore();

const handleSignupSubmit = async () => {
  try {
    await signUp(email, password, nickname, "freelancer", {
      phone: phone,
      nickname: nickname,
      role: "creator", // 또는 'expert'
      mainExpertise: selectedCategories, // 관심 분야 카테고리
      experienceYears: career, // 경력 정보
    });
    
    router.push("/projects"); // 가입 완료 후 공모전 목록으로 이동
  } catch (err: any) {
    alert(err.message || "회원가입 처리 중 오류가 발생했습니다.");
  }
};
```

---

## 4. 새로고침 세션 유지 (`initialize`)

Next.js 웹앱은 브라우저를 새로고침하면 Zustand 전역 상태가 초기화됩니다. 로컬 스토리지에 로그인 정보가 저장되어 있더라도, 실제 Supabase 서버의 토큰 유효성을 검증하고 세션을 동기화하기 위해 앱 로드 시 최초 1회 초기화 처리가 필요합니다.

* **함수 시그니처**: `initialize: () => Promise<void>`

### 💻 연동 코드 예시 (`app/layout.tsx` 또는 `app/providers.tsx`)
```tsx
"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/store/authStore";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((s) => s.initialize);

  useEffect(() => {
    // 💡 앱 구동 또는 새로고침 시 로그인 세션 자동 복구
    initializeAuth();
  }, [initializeAuth]);

  return <>{children}</>;
}
```

---

## 5. 로그아웃 API (`logout`)

Supabase Auth 세션을 종료하고, Zustand 스토어에 보존되어 있던 사용자 정보를 완전히 초기화합니다.

* **함수 시그니처**: `logout: () => Promise<void>`

### 💻 연동 코드 예시 (`shared/components/Header.tsx` 등)
```tsx
const { isLoggedIn, user, logout } = useAuthStore();

const handleSignout = async () => {
  await logout();
  alert("로그아웃 되었습니다.");
  router.push("/"); // 메인 페이지로 이동
};
```

---

## 6. 자주 발생하는 트러블슈팅 및 장애 대처

개발 과정에서 프론트엔드 개발자가 마주할 수 있는 가장 대표적인 장애 요인과 대처법입니다.

### 🚨 1. 회원가입 시 `42501 (Permission Denied / RLS Policy)` 에러가 납니다.
* **원인**: Supabase RLS가 활성화되어 있어 비로그인(`anon`) 또는 가입 중인 유저가 `user_profiles`, `clients`, `freelancers` 테이블에 `INSERT`하는 행위가 거부된 것입니다.
* **해결책 (선택)**:
  * **개발 환경**: Supabase 대시보드 -> Database -> Tables에서 해당 테이블의 RLS를 **`Disabled`**로 토글합니다. (모든 보안 검사 생략시킴)
  * **프로덕션 환경**: SQL Editor에서 누구나(또는 신규 가입자) 가입 시점에 해당 테이블에 데이터를 삽입할 수 있도록 다음 RLS 정책을 실행합니다.
    ```sql
    -- user_profiles 테이블에 대한 가입 시점 INSERT 허용 정책
    CREATE POLICY "Allow anon insert user_profiles" ON public.user_profiles 
    FOR INSERT WITH CHECK (true);
    
    -- clients 테이블에 대한 가입 시점 INSERT 허용 정책
    CREATE POLICY "Allow anon insert clients" ON public.clients 
    FOR INSERT WITH CHECK (true);
    
    -- freelancers 테이블에 대한 가입 시점 INSERT 허용 정책
    CREATE POLICY "Allow anon insert freelancers" ON public.freelancers 
    FOR INSERT WITH CHECK (true);
    ```

### 🚨 2. Next.js 새로고침 시 하이드레이션 불일치(Hydration Mismatch) 에러가 납니다.
* **원인**: Zustand의 `persist` 미들웨어로 인해 로컬 스토리지에 데이터가 남아있는 경우, SSR(서버 렌더링) 뷰와 CSR(브라우저 렌더링) 뷰가 불일치하여 발생합니다.
* **해결책**:
  * 컴포넌트 마운트가 완전히 완료된 후에 인증 UI가 보이도록 제어하거나, `useAuthStore`의 `initialize()`를 통해 비동기적으로 복구하도록 설정합니다.
  ```tsx
  import { useEffect, useState } from "react";
  import { useAuthStore } from "@/features/auth/store/authStore";
  
  export function ProfileWidget() {
    const { user, isLoggedIn } = useAuthStore();
    const [isMounted, setIsMounted] = useState(false);
  
    useEffect(() => {
      setIsMounted(true);
    }, []);
  
    // 하이드레이션 오류 원천 차단
    if (!isMounted) return null; 
  
    return isLoggedIn ? <p>{user?.name}님 환영합니다!</p> : <button>로그인</button>;
  }
  ```

### 🚨 3. 로그인/회원가입 기능 호출 시 Supabase Client URL/Key 에러가 납니다.
* **원인**: `.env.local` 파일에 Supabase 접속 환경 변수가 누락되었거나 로드되지 않은 경우입니다.
* **해결책**: 루트 폴더에 `.env.local` 파일을 생성하고 다음 변수명이 정확한지 확인합니다. (Next.js 브라우저 측에서 접근하기 위해 반드시 `NEXT_PUBLIC_` 접두사가 포함되어야 합니다.)
  ```env
  NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
