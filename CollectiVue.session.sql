-- =============================================================================
-- 2단계 보완: 공모전 진행단계(status) 추가 및 자동화 트리거 마이그레이션 (오늘 작업분)
-- =============================================================================

-- 1. projects 테이블에 status 컬럼 추가
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'recruiting' CHECK (status IN ('recruiting', 'judging', 'ended'));

-- 2. 당선작 선정 시 projects.status 자동으로 'ended' 전환하는 트리거 함수 및 트리거 설정
CREATE OR REPLACE FUNCTION public.handle_winner_selected()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_selected = TRUE AND (OLD.is_selected IS NULL OR OLD.is_selected = FALSE) THEN
    UPDATE public.projects
    SET status = 'ended'
    WHERE id = NEW.project_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 기존 동일한 트리거가 있을 수 있으므로 중복 생성 방지를 위한 DROP 처리
DROP TRIGGER IF EXISTS on_winner_selected ON public.project_submissions;

-- 트리거 생성
CREATE TRIGGER on_winner_selected
  AFTER INSERT OR UPDATE OF is_selected ON public.project_submissions
  FOR EACH ROW EXECUTE FUNCTION public.handle_winner_selected();


-- ==========================================
-- [4단계] RLS 정책 보완: 당선작 선정(UPDATE) 권한 부여
-- ==========================================
-- 해당 공모전을 주최한 브랜드의 소유주(client_id)만 제출물(is_selected 등)을 수정(UPDATE)할 수 있도록 허용
DROP POLICY IF EXISTS "Allow client select winner" ON public.project_submissions;

CREATE POLICY "Allow client select winner" ON public.project_submissions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.projects
      JOIN public.brands ON brands.id = projects.brand_id
      WHERE projects.id = project_submissions.project_id 
        AND brands.client_id = auth.uid()
    )
  );


-- =============================================================================
-- [4단계 추가 작업] 제출물 파일 구조 다중화 (Multiple Submission Files)
-- =============================================================================
-- portfolio_file_url(TEXT) 컬럼이 있을 경우 TEXT[] 배열 타입으로 변환 후 컬럼명을 portfolio_file_urls로 변경
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'project_submissions' 
      AND column_name = 'portfolio_file_url'
  ) THEN
    -- 1. 타입을 TEXT[]로 임시 변환 (기존 값을 요소가 하나인 배열로 변환)
    ALTER TABLE public.project_submissions 
      ALTER COLUMN portfolio_file_url TYPE TEXT[] USING ARRAY[portfolio_file_url];
    
    -- 2. 컬럼명을 portfolio_file_urls로 변경
    ALTER TABLE public.project_submissions 
      RENAME COLUMN portfolio_file_url TO portfolio_file_urls;
      
    -- 3. 디폴트 값 설정
    ALTER TABLE public.project_submissions 
      ALTER COLUMN portfolio_file_urls SET DEFAULT '{}';
  END IF;
END $$;


-- =============================================================================
-- [RLS 보완] 회원가입 프로필 생성(INSERT/UPSERT) 및 조회(SELECT) 권한 부여
-- =============================================================================
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select user_profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow public insert user_profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow public update user_profiles" ON public.user_profiles;
CREATE POLICY "Allow public select user_profiles" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert user_profiles" ON public.user_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update user_profiles" ON public.user_profiles FOR UPDATE USING (true);

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select clients" ON public.clients;
DROP POLICY IF EXISTS "Allow public insert clients" ON public.clients;
DROP POLICY IF EXISTS "Allow public update clients" ON public.clients;
CREATE POLICY "Allow public select clients" ON public.clients FOR SELECT USING (true);
CREATE POLICY "Allow public insert clients" ON public.clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update clients" ON public.clients FOR UPDATE USING (true);

ALTER TABLE public.freelancers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select freelancers" ON public.freelancers;
DROP POLICY IF EXISTS "Allow public insert freelancers" ON public.freelancers;
DROP POLICY IF EXISTS "Allow public update freelancers" ON public.freelancers;
CREATE POLICY "Allow public select freelancers" ON public.freelancers FOR SELECT USING (true);
CREATE POLICY "Allow public insert freelancers" ON public.freelancers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update freelancers" ON public.freelancers FOR UPDATE USING (true);


-- =============================================================================
-- [시퀀스 동기화] 시드 데이터 추가 후 PK 중복(23505 duplicate key) 에러 방지
-- =============================================================================
SELECT setval(pg_get_serial_sequence('public.brands', 'id'), COALESCE((SELECT MAX(id) FROM public.brands), 1));
SELECT setval(pg_get_serial_sequence('public.projects', 'id'), COALESCE((SELECT MAX(id) FROM public.projects), 1));
SELECT setval(pg_get_serial_sequence('public.project_submissions', 'id'), COALESCE((SELECT MAX(id) FROM public.project_submissions), 1));
SELECT setval(pg_get_serial_sequence('public.banner', 'id'), COALESCE((SELECT MAX(id) FROM public.banner), 1));
SELECT setval(pg_get_serial_sequence('public.menus', 'id'), COALESCE((SELECT MAX(id) FROM public.menus), 1));


