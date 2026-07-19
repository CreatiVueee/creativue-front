-- =============================================================================
-- CreatiVue Supabase DB 시드 데이터 (Seed Data) 스크립트
-- =============================================================================

-- 기존 데이터 초기화 (재시딩 편의용)
TRUNCATE public.project_submissions CASCADE;
TRUNCATE public.project_applicants CASCADE;
TRUNCATE public.projects CASCADE;
TRUNCATE public.brands CASCADE;
TRUNCATE public.freelancers CASCADE;
TRUNCATE public.clients CASCADE;
TRUNCATE public.user_profiles CASCADE;
TRUNCATE public.banner CASCADE;

-- 1. auth.users 에 사용자 직접 삽입 (Supabase Auth 연동용)
-- Local/Docker Supabase DB에 직접 삽입하기 위해 encrypt 패스워드는 임의 처리
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'client1@example.com', '', NOW(), '{"provider":"email","providers":["email"]}', '{"user_type": "client", "user_id": "client1"}', 'authenticated', 'authenticated', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000002', 'client2@example.com', '', NOW(), '{"provider":"email","providers":["email"]}', '{"user_type": "client", "user_id": "client2"}', 'authenticated', 'authenticated', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000003', 'client3@example.com', '', NOW(), '{"provider":"email","providers":["email"]}', '{"user_type": "client", "user_id": "client3"}', 'authenticated', 'authenticated', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000004', 'client4@example.com', '', NOW(), '{"provider":"email","providers":["email"]}', '{"user_type": "client", "user_id": "client4"}', 'authenticated', 'authenticated', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000005', 'client5@example.com', '', NOW(), '{"provider":"email","providers":["email"]}', '{"user_type": "client", "user_id": "client5"}', 'authenticated', 'authenticated', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000006', 'client6@example.com', '', NOW(), '{"provider":"email","providers":["email"]}', '{"user_type": "client", "user_id": "client6"}', 'authenticated', 'authenticated', NOW(), NOW()),
  
  ('00000000-0000-0000-0000-000000000011', 'freelancer1@example.com', '', NOW(), '{"provider":"email","providers":["email"]}', '{"user_type": "freelancer", "user_id": "freelancer1"}', 'authenticated', 'authenticated', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000012', 'freelancer2@example.com', '', NOW(), '{"provider":"email","providers":["email"]}', '{"user_type": "freelancer", "user_id": "freelancer2"}', 'authenticated', 'authenticated', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000013', 'freelancer3@example.com', '', NOW(), '{"provider":"email","providers":["email"]}', '{"user_type": "freelancer", "user_id": "freelancer3"}', 'authenticated', 'authenticated', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000014', 'freelancer4@example.com', '', NOW(), '{"provider":"email","providers":["email"]}', '{"user_type": "freelancer", "user_id": "freelancer4"}', 'authenticated', 'authenticated', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000015', 'freelancer5@example.com', '', NOW(), '{"provider":"email","providers":["email"]}', '{"user_type": "freelancer", "user_id": "freelancer5"}', 'authenticated', 'authenticated', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 💡 참고: auth.users에 INSERT 시, CollectiVue.session.sql에 정의된 handle_new_user 트리거에 의해
-- public.user_profiles 테이블에도 자동으로 로우가 생성됩니다.

-- 2. clients 테이블 시딩
INSERT INTO public.clients (id, interested_fields)
VALUES
  ('00000000-0000-0000-0000-000000000001', ARRAY['IT / 테크']),
  ('00000000-0000-0000-0000-000000000002', ARRAY['환경 / 지속가능성']),
  ('00000000-0000-0000-0000-000000000003', ARRAY['패션 / 뷰티']),
  ('00000000-0000-0000-0000-000000000004', ARRAY['푸드 / 음료']),
  ('00000000-0000-0000-0000-000000000005', ARRAY['IT / 테크']),
  ('00000000-0000-0000-0000-000000000006', ARRAY['IT / 테크'])
ON CONFLICT (id) DO NOTHING;

-- 3. freelancers 테이블 시딩
INSERT INTO public.freelancers (id, nickname, profile_url, role, main_expertise, experience_years)
VALUES
  ('00000000-0000-0000-0000-000000000011', '김지영', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'designer', ARRAY['브랜딩'], '3년'),
  ('00000000-0000-0000-0000-000000000012', '이서준', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'designer', ARRAY['디지털 광고'], '5년'),
  ('00000000-0000-0000-0000-000000000013', '박민아', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', 'creator', ARRAY['소셜미디어'], '2년'),
  ('00000000-0000-0000-0000-000000000014', '최현우', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'creator', ARRAY['네이밍/슬로건'], '4년'),
  ('00000000-0000-0000-0000-000000000015', '정다은', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', 'designer', ARRAY['로고디자인'], '1년')
ON CONFLICT (id) DO NOTHING;

-- 4. brands 테이블 시딩
INSERT INTO public.brands (id, client_id, brand_name, brand_identity, brand_story, brand_core_keywords, brand_image, logo_file_url, industries, input_type, target_ages, target_gender, target_interests, target_jobs, target_market, target_region, extra_notes, extra_notes_etc, created_at, updated_at)
VALUES
  (
    1, '00000000-0000-0000-0000-000000000001', 'TechStart Inc.', 
    '혁신적이고 신뢰할 수 있는 B2B SaaS 스타트업', 
    'TechStart Inc.는 2021년 서울에서 설립된 B2B SaaS 스타트업으로, 중소기업의 디지털 전환을 돕는 솔루션을 제공합니다. ''기술로 더 나은 비즈니스를''이라는 슬로건 아래, 복잡한 업무 흐름을 단순하게 만드는 것을 목표로 합니다.',
    ARRAY['혁신', '신뢰', '미래지향적', '심플', '전문적'],
    'https://images.unsplash.com/photo-1590102426275-8d1c367070d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    ARRAY['https://images.unsplash.com/photo-1622465911894-1e73cbdc293a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', 'https://images.unsplash.com/photo-1642132652866-6fa262d3161f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080'],
    ARRAY['IT / 테크'], 'form', ARRAY['28-35세', '36-45세'], '성별 무관', ARRAY['기술 트렌드', '비즈니스 혁신', '생산성'],
    '중소기업 경영진 · IT 담당자', '국내 B2B', ARRAY['서울', '수도권'],
    '브랜드 컬러인 네이비와 블루 계열을 유지해 주세요. 신뢰감과 전문성이 느껴지는 방향으로 제작 부탁드립니다.', NULL, 
    '2026-06-15 10:00:00+00', '2026-06-15 10:00:00+00'
  ),
  (
    2, '00000000-0000-0000-0000-000000000002', 'GreenPack Co.', 
    '자연 친화적이고 지속 가능한 패키징 브랜드', 
    'GreenPack Co.는 ''포장재도 지구의 일부''라는 철학으로 2020년 창업했습니다. 100% 생분해 소재를 사용하며, 버려진 해양 플라스틱을 업사이클링한 제품 라인을 운영하고 있습니다.',
    ARRAY['친환경', '자연', '지속가능성', '따뜻함', '책임감'],
    'https://images.unsplash.com/photo-1684326156737-4755d6d03524?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    ARRAY['https://images.unsplash.com/photo-1739949381110-81f449e5a494?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', 'https://images.unsplash.com/photo-1760368104753-fe0994f94ff3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080'],
    ARRAY['환경 / 지속가능성'], 'form', ARRAY['22-30세', '31-40세'], '여성 60% · 남성 40%', ARRAY['제로웨이스트', '비건', '지속가능한 라이프스타일'],
    '환경 의식 있는 일반 소비자', '국내 전국 · 유럽 일부', ARRAY['전국'],
    '그린 계열 색상 중심으로, 따뜻하고 유기적인 느낌으로 표현해 주세요.', NULL, 
    '2026-06-12 09:00:00+00', '2026-06-12 09:00:00+00'
  ),
  (
    3, '00000000-0000-0000-0000-000000000003', 'Glow Beauty', 
    '감각적이고 자신감 넘치는 K-뷰티 럭셔리 브랜드', 
    'Glow Beauty는 2019년 론칭한 프리미엄 K-뷰티 브랜드입니다. ''당신의 빛을 발견하라''는 메시지를 중심으로, 피부 본연의 아름다움을 극대화하는 스킨케어 라인을 선보이고 있습니다.',
    ARRAY['글로우', '럭셔리', '자신감', '감각적', 'K-뷰티'],
    'https://images.unsplash.com/photo-1776015036380-4022fe844ed8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    ARRAY['https://images.unsplash.com/photo-1765887986673-953fccf56464?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', 'https://images.unsplash.com/photo-1764698192249-641a17d7a4fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080'],
    ARRAY['패션 / 뷰티'], 'form', ARRAY['20-25세', '26-35세'], '여성 중심', ARRAY['스킨케어', '메이크업', 'K-pop', '인스타그램'],
    '뷰티·패션에 관심 높은 직장인 · 대학생', '한국 · 일본 · 동남아시아', ARRAY['한국', '일본', '동남아시아'],
    '로즈 핑크와 골드 컬러 조합을 선호합니다. 해외 광고는 영문 카피도 함께 제안해 주세요.', NULL, 
    '2026-06-10 08:00:00+00', '2026-06-10 08:00:00+00'
  ),
  (
    4, '00000000-0000-0000-0000-000000000004', 'Brew House', 
    '동네 사람들이 편하게 드나드는 아날로그 감성 카페', 
    'Brew House는 2018년 성수동 골목에서 시작한 카페 브랜드입니다. 바리스타가 직접 로스팅한 원두와 제철 재료를 활용한 음료로 입소문을 탔고, 현재 전국 8개 지점으로 성장했습니다.',
    ARRAY['아날로그', '따뜻함', '레트로', '정직함', '동네 감성'],
    'https://images.unsplash.com/photo-1774921676744-4c4133c44bf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    ARRAY['https://images.unsplash.com/photo-1622465911894-1e73cbdc293a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', 'https://images.unsplash.com/photo-1760368104753-fe0994f94ff3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080'],
    ARRAY['푸드 / 음료'], 'form', ARRAY['22-30세', '31-38세'], '성별 무관', ARRAY['커피', '독서', '로컬 문화', '빈티지'],
    '카페를 즐겨 찾는 직장인 · 프리랜서', '국내 전국', ARRAY['전국'],
    '오래된 커피숍 느낌의 따뜻하고 정감 있는 스타일로 부탁드립니다. 영문·한글 로고 버전 모두 제안해 주세요.', NULL, 
    '2026-06-08 11:00:00+00', '2026-06-08 11:00:00+00'
  ),
  (
    5, '00000000-0000-0000-0000-000000000005', 'DigitalMake', 
    '크리에이터를 위한 올인원 디지털 마케팅 플랫폼', 
    'DigitalMake는 소규모 크리에이터와 1인 기업이 손쉽게 디지털 광고를 제작·집행할 수 있도록 돕는 플랫폼입니다. 2022년 출시 이후 MAU 50만을 돌파하며 급성장 중입니다.',
    ARRAY['역동적', '테크', '접근성', '크리에이티브', '성장'],
    'https://images.unsplash.com/photo-1767449441925-737379bc2c4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    ARRAY['https://images.unsplash.com/photo-1642132652866-6fa262d3161f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', 'https://images.unsplash.com/photo-1622465911894-1e73cbdc293a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080'],
    ARRAY['IT / 테크'], 'form', ARRAY['20-25세', '26-35세'], '성별 무관', ARRAY['SNS 마케팅', '콘텐츠 제작', '디지털 트렌드'],
    '1인 크리에이터 · 스타트업 마케터', '국내 전국', ARRAY['전국'],
    '퍼플·인디고 계열의 브랜드 컬러를 활용하되, 역동적이고 생동감 있는 구성을 원합니다.', NULL, 
    '2026-06-05 07:00:00+00', '2026-06-05 07:00:00+00'
  ),
  (
    6, '00000000-0000-0000-0000-000000000006', 'TechCorp Korea', 
    '글로벌 시장을 선도하는 한국 대표 IT 기업', 
    'TechCorp Korea는 1998년 설립된 종합 IT 솔루션 기업으로, 클라우드·AI·보안 분야에서 아시아 10개국에 서비스를 제공하고 있습니다. 창립 이후 꾸준한 R&D 투자로 국내 IT 특허 1위를 기록하고 있습니다.',
    ARRAY['글로벌', '리더십', '신뢰', '혁신', '첨단기술'],
    'https://images.unsplash.com/photo-1764123108291-0f48d2c7e563?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    ARRAY['https://images.unsplash.com/photo-1762163516269-3c143e04175c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080', 'https://images.unsplash.com/photo-1642132652866-6fa262d3161f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080'],
    ARRAY['IT / 테크'], 'form', ARRAY['30-40세', '41-55세'], '성별 무관', ARRAY['클라우드 전환', 'AI 솔루션', '사이버보안'],
    '대기업 IT 담당자 · 해외 기업 의사결정자', '한국 · 일본 · 동남아 · 북미', ARRAY['한국', '일본', '동남아', '북미'],
    '글로벌 B2B 톤앤매너를 유지해 주세요. 영문 카피 포함 버전과 각 국가별 현지화 버전을 제안해 주시면 좋겠습니다.', NULL, 
    '2026-06-01 06:00:00+00', '2026-06-01 06:00:00+00'
  )
ON CONFLICT (id) DO NOTHING;

-- 5. projects 테이블 시딩
INSERT INTO public.projects (id, brand_id, title, content_categories, content_purpose, differentiation_point, required_content, reference_image_url, price_range, reward_amount, paid_amount, deadline_date, is_ai_allowed, qc_count, additional_info, status, created_at)
VALUES
  (
    1, 1, 'TechStart Inc. 공모전', ARRAY['로고', '디지털 광고 템플릿'], ARRAY['브랜드 인지도 향상'],
    '국내 중소기업에 최적화된 한국어 UX와 국세청 연동 자동화 기능으로, 해외 SaaS 대비 온보딩 시간을 70% 단축합니다.',
    ARRAY['로고', '디지털 광고 템플릿'], ARRAY['https://images.unsplash.com/photo-1622465911894-1e73cbdc293a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080'],
    '월 구독 ₩49,000 ~ ₩299,000 (플랜별)', 3000000, 0, '2026-06-30', TRUE, NULL,
    '현재 무료 체험 30일 제공 중이며, 연간 결제 시 20% 할인 혜택이 있습니다.', 'recruiting', '2026-06-15 10:00:00+00'
  ),
  (
    2, 2, 'GreenPack Co. 공모전', ARRAY['제품 디자인', '상세페이지'], ARRAY['제품 판매 전환'],
    '해양 폐플라스틱 업사이클링 소재를 상용화한 식품용 포장재로, 일반 종이백 대비 탄소 배출량 58% 절감 인증을 받았습니다.',
    ARRAY['제품 디자인', '상세페이지'], ARRAY['https://images.unsplash.com/photo-1739949381110-81f449e5a494?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080'],
    '₩2,500 ~ ₩18,000 (단품 기준) / 기업 대량 주문 별도 협의', 2000000, 0, '2026-07-05', FALSE, NULL,
    'B2B 기업 고객에게는 전용 패키징 디자인 커스터마이징 서비스도 제공하며, MOQ는 500개입니다.', 'judging', '2026-06-12 09:00:00+00'
  ),
  (
    3, 3, 'Glow Beauty 공모전', ARRAY['DA', '배너 광고', '해외 광고'], ARRAY['해외 시장 진출', '브랜드 인지도 향상'],
    '국내 특허 발효 성분 ''Glow-X™''를 독점 적용해 4주 만에 피부 광도 42% 개선 효과를 임상으로 입증했습니다.',
    ARRAY['DA', '배너 광고', '해외 광고'], ARRAY['https://images.unsplash.com/photo-1765887986673-953fccf56464?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080'],
    '₩28,000 ~ ₩120,000 (스킨케어 라인) / 세트 구성 시 최대 30% 할인', 5000000, 0, '2026-07-10', TRUE, NULL,
    '일본 라쿠텐·라자다 동남아 입점 완료. 면세점 전용 한정 패키지 라인업도 운영 중입니다.', 'recruiting', '2026-06-10 08:00:00+00'
  ),
  (
    4, 4, 'Brew House 공모전', ARRAY['로고', '포스터 템플릿'], ARRAY['브랜드 리뉴얼'],
    '전국 소농가와 직접 계약한 단일 원산지 원두를 사용하며, 주문 즉시 핸드드립으로 제공합니다.',
    ARRAY['로고', '포스터 템플릿'], ARRAY['https://images.unsplash.com/photo-1622465911894-1e73cbdc293a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080'],
    '음료 ₩4,500 ~ ₩8,500 / 베이커리 ₩3,000 ~ ₩7,000', 1500000, 0, '2026-07-20', FALSE, NULL,
    '멤버십 가입 시 음료 10% 상시 할인 적용. 매월 한정판 시즌 메뉴 운영 중.', 'recruiting', '2026-06-08 11:00:00+00'
  ),
  (
    5, 5, 'DigitalMake 공모전', ARRAY['디지털 광고 템플릿', '배너 광고'], ARRAY['사용자 획득', '브랜드 인지도 향상'],
    'AI 자동 광고 소재 생성 기능으로 평균 제작 시간을 90% 단축하며, 국내 주요 플랫폼 동시 집행 연동을 단일 대시보드에서 지원합니다.',
    ARRAY['디지털 광고 템플릿', '배너 광고'], ARRAY['https://images.unsplash.com/photo-1642132652866-6fa262d3161f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080'],
    '무료 플랜 / 프로 ₩15,900/월 / 비즈니스 ₩49,000/월', 4000000, 0, '2026-07-15', TRUE, NULL,
    '비즈니스 플랜 이상 구독 시 전담 마케팅 컨설턴트 배정. 연간 결제 시 2개월 무료.', 'recruiting', '2026-06-05 07:00:00+00'
  ),
  (
    6, 6, 'TechCorp Korea 공모전', ARRAY['해외 광고', '디지털 광고 템플릿', '배너 광고'], ARRAY['글로벌 시장 진출', '브랜드 인지도 향상'],
    '자체 개발 AI 보안 엔진 ''ShieldAI 3.0''으로 사이버 위협 탐지 정확도 99.7%를 달성했으며, ISMS·ISO27001 국제 인증을 동시 보유한 국내 유일 기업입니다.',
    ARRAY['해외 광고', '디지털 광고 템플릿', '배너 광고'], ARRAY['https://images.unsplash.com/photo-1762163516269-3c143e04175c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080'],
    '클라우드 플랜 $500~/월 (USD) / 엔터프라이즈 솔루션 별도 견적', 6000000, 0, '2026-07-25', TRUE, NULL,
    'POC(개념 검증) 무료 제공 후 도입 여부 결정 가능. 글로벌 고객사 전용 24/7 다국어 기술 지원 센터 운영.', 'recruiting', '2026-06-01 06:00:00+00'
  )
ON CONFLICT (id) DO NOTHING;

-- 6. project_applicants (지원자 내역) 시딩
-- 💡 인기 공모전(HOT) 동적 테스트를 위해 일부 프로젝트에 지원자를 집중 분포시킴
INSERT INTO public.project_applicants (project_id, freelancer_id, applied_at)
VALUES
  -- 프로젝트 1 (지원자 5명 -> HOT 활성화)
  (1, '00000000-0000-0000-0000-000000000011', NOW()),
  (1, '00000000-0000-0000-0000-000000000012', NOW()),
  (1, '00000000-0000-0000-0000-000000000013', NOW()),
  (1, '00000000-0000-0000-0000-000000000014', NOW()),
  (1, '00000000-0000-0000-0000-000000000015', NOW()),

  -- 프로젝트 2 (지원자 3명 -> 일반 공모전)
  (2, '00000000-0000-0000-0000-000000000011', NOW()),
  (2, '00000000-0000-0000-0000-000000000012', NOW()),
  (2, '00000000-0000-0000-0000-000000000013', NOW()),

  -- 프로젝트 3 (지원자 5명 -> HOT 활성화)
  (3, '00000000-0000-0000-0000-000000000011', NOW()),
  (3, '00000000-0000-0000-0000-000000000012', NOW()),
  (3, '00000000-0000-0000-0000-000000000013', NOW()),
  (3, '00000000-0000-0000-0000-000000000014', NOW()),
  (3, '00000000-0000-0000-0000-000000000015', NOW()),

  -- 프로젝트 4 (지원자 2명 -> 일반 공모전)
  (4, '00000000-0000-0000-0000-000000000011', NOW()),
  (4, '00000000-0000-0000-0000-000000000012', NOW()),

  -- 프로젝트 5 (지원자 1명 -> 일반 공모전)
  (5, '00000000-0000-0000-0000-000000000014', NOW())
ON CONFLICT (project_id, freelancer_id) DO NOTHING;

-- 7. project_submissions (포트폴리오 제출물) 시딩
INSERT INTO public.project_submissions (id, project_id, freelancer_id, portfolio_file_urls, layout_rationale, color_system_rationale, tone_and_manner, additional_description, is_selected)
VALUES
  (
    1, 1, '00000000-0000-0000-0000-000000000011', 
    ARRAY['https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800', 'https://images.unsplash.com/photo-1622465911894-1e73cbdc293a?w=800'],
    '좌측 로고 배치와 직관적인 카드형 그리드 디자인으로 B2B 사용자의 정보 인지 속도를 개선했습니다.',
    '신뢰감(Trust)을 주기 위해 딥 네이비를 메인으로, 성장(Growth)을 상징하는 밝은 블루를 포인트로 활용했습니다.',
    'Professional & Modern (전문적이며 정돈된 느낌)',
    '사용자 피드백을 기반으로 3회 리비전을 거쳐 고도화한 시안입니다.',
    TRUE -- 당선자
  ),
  (
    2, 1, '00000000-0000-0000-0000-000000000012', 
    ARRAY['https://images.unsplash.com/photo-1541462608141-2ff034033b04?w=800'],
    '와이드형 레이아웃으로 모바일과 데스크톱 반응형 뷰를 매끄럽게 호환되도록 구성했습니다.',
    '미래지향적인 느낌을 전달하기 위해 다크 그레이와 네온 퍼절을 조합했습니다.',
    'Futuristic & Vivid (미래지향적이고 생동감 있는 느낌)',
    'AI 솔루션의 고성능 이미지를 부각하는 방향으로 집중했습니다.',
    FALSE
  ),
  (
    3, 2, '00000000-0000-0000-0000-000000000013', 
    ARRAY['https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800'],
    '친환경 종이 질감을 직접 살릴 수 있도록 여백의 미를 극대화한 비정형 타이포그래피 레이아웃입니다.',
    '자연의 느낌을 직관적으로 드러내는 포레스트 그린과 유기농 크래프트 브라운을 매칭했습니다.',
    'Eco-friendly & Organic (자연친화적이고 유기적인 느낌)',
    '식품용으로 사용할 때 따뜻함과 안전한 인상을 심어줄 수 있도록 제작했습니다.',
    FALSE
  )
ON CONFLICT (id) DO NOTHING;

-- 8. banner (메인 배너) 시딩
INSERT INTO public.banner (id, badge_text, main_title, sub_title, description, image, sort_order)
VALUES
  (
    1, 
    'Problem 01', 
    '주관적 시각', 
    '대표자의 눈에 예쁜 포스터가 정답?', 
    '브랜드 전략 없이 대표자 개인의 취향으로 디자인을 선택하면, 정작 소비자에게는 전혀 다른 메시지가 전달됩니다.', 
    'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800', 
    1
  ),
  (
    2, 
    'Problem 02', 
    '불명확한 브랜드 정의', 
    '자사 브랜드를 모른 채 마케팅 시작', 
    '브랜드 아이덴티티 없이 프리랜서 평점만 보고 의뢰하면 매번 다른 결과물이 나옵니다. 일관성 있는 브랜드를 만들 수 없어요.', 
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800', 
    2
  ),
  (
    3, 
    'Problem 03', 
    '브랜딩 = 로고?', 
    '로고 하나로 마케팅을 시작하는 함정', 
    '로고는 브랜딩의 시작일 뿐입니다. 색상 체계, 톤앤매너, 타겟 페르소나 없이는 로고조차 제 역할을 못합니다.', 
    'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800', 
    3
  ),
  (
    4, 
    'Problem 04', 
    '불명확한 타게팅', 
    '"누구에게 팔고 싶으세요?" → 침묵', 
    '타겟 고객을 명확히 정의하지 못하면 어떤 마케팅도 효과를 내기 어렵습니다. 모두를 타겟으로 삼으면 아무도 잡을 수 없습니다.', 
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800', 
    4
  ),
  (
    5, 
    'Problem 05', 
    '해외 시장의 장벽', 
    '현지 정서를 모르는 글로벌 콘텐츠', 
    '해외 소비자를 대상으로 한 콘텐츠에 정서적·문화적·언어적 오류가 있으면 브랜드 이미지가 심각하게 손상될 수 있습니다.', 
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800', 
    5
  )
ON CONFLICT (id) DO NOTHING;

