# Project Context for Claude Code

> 이 파일은 Claude Code(VSCode 터미널 통합)가 자동으로 읽어서 컨텍스트를 잡는 핸드오프 노트입니다. 사용자가 새 세션을 열어도 이 파일만 보면 프로젝트 상태를 즉시 파악할 수 있습니다.

---

## 프로젝트 개요

- **이름:** TOEFL 96 Trainer
- **목적:** 사용자 본인(전병탁, Principal Engineer · AI PM)이 **TOEFL iBT 96점**을 받아 **서울대 AI 대학원 박사**에 진학하기 위한 6개월(26주) 셀프 트레이닝 PWA
- **목표 점수 영역 분배:** Reading 27 / Listening 24 / Speaking 22 / Writing 25 = 98 (안전 마진 +2)
- **사용자 출발점:** 독해 강점, 듣기·말하기 약함, 직장 병행
- **언어:** UI는 영문 라벨 위주, 한국어 보조 / 코드/주석은 영문

---

## 현재 상태 (2026-05-25 기준)

**모든 파일 작성 완료. GitHub Pages 배포만 남음.**

```
toefl-trainer/
├── index.html                   # 단일 파일 SPA (Tailwind CDN + 인라인 JS)
├── manifest.json                # PWA manifest (standalone, indigo theme)
├── sw.js                        # 서비스 워커 (오프라인 캐시, cache-first)
├── icon-192.png                 # PWA 아이콘
├── icon-512.png                 # PWA 아이콘 고해상도
├── icon-maskable-512.png        # Android adaptive icon
├── apple-touch-icon.png         # iOS 홈 화면 아이콘
├── favicon-32.png
├── README.md                    # 사용자용 배포 가이드 (한국어)
├── CLAUDE.md                    # ← 이 파일 (Claude Code 핸드오프)
├── .gitignore
└── .github/workflows/
    └── deploy.yml               # GitHub Actions 자동 배포
```

---

## 기능 구조 (index.html 내부)

5개 탭으로 구성된 단일 페이지 앱:

| 탭 | 내용 | 데이터 저장 |
|---|---|---|
| **Dashboard** | 일일 학습량, 스트릭, 26주 Phase 진도, 최근 7일 차트 | localStorage |
| **Vocabulary** | SM-2 간격 반복(SRS), AWL 시드 50개, CSV 일괄 가져오기 | localStorage |
| **Speaking** | TOEFL 4과제 타이머, MediaRecorder 녹음 | metadata=localStorage, audio blob=IndexedDB |
| **Shadowing** | 로컬 오디오/YouTube + 자막 라인별 점프 + 구간 반복 | localStorage |
| **Settings** | 시작일·목표·일일목표 설정, JSON 백업/복원, 전체 초기화 | localStorage |

---

## 기술 스택 & 의존성

- 빌드 도구 **없음** — 단일 HTML 파일을 브라우저가 직접 실행
- **Tailwind CSS** via CDN (`https://cdn.tailwindcss.com`)
- **Inter + Noto Sans KR** via Google Fonts
- **YouTube IFrame API** — 섀도잉 탭에서만 동적 로드
- **MediaRecorder API** — Speaking 녹음 (audio/webm)
- **IndexedDB** — 오디오 blob 영속 저장 (DB명: `toefl96_audio`)
- **localStorage** — 모든 메타데이터/설정 (키: `toefl96_v1`)
- **Service Worker** — 오프라인 캐시 (앱 셸 cache-first, YouTube network-only)

**서버 없음.** 모든 사용자 데이터는 기기 로컬에만 저장. 외부 전송 없음.

---

## 즉시 다음 작업 — GitHub Pages 배포

사용자가 GitHub 웹에서 새 레포 `toefl-trainer` 를 **Public**으로 이미 생성한 상태(또는 곧 생성할 예정). 다음 명령으로 푸시:

```bash
# 현재 폴더가 toefl-trainer/ 라고 가정
git init
git add .
git commit -m "Initial commit: TOEFL 96 Trainer PWA"
git branch -M main
git remote add origin https://github.com/btjeon/toefl-trainer.git
git push -u origin main
```

푸시 후:
1. GitHub 레포 → **Settings** → **Pages** → **Source: GitHub Actions** 선택
2. `.github/workflows/deploy.yml` 자동 트리거 (1~2분 소요)
3. 라이브 URL: `https://btjeon.github.io/toefl-trainer/`

배포 확인 후 사용자가 스마트폰 사파리/크롬으로 접속해서 **"홈 화면에 추가"** 하면 PWA로 설치됨.

---

## 핸드오프 — 사용자가 다음에 요청할 가능성이 높은 작업

우선순위순:

1. **git push 도와주기** — origin URL 확인, 인증 토큰/SSH 키 문제 해결
2. **배포 후 검증** — `curl https://btjeon.github.io/toefl-trainer/manifest.json` 등으로 PWA 메타 응답 확인
3. **Writing 탭 추가** — 30분 타이머 + Claude/GPT API 첨삭 (사용자가 만들고 싶어할 가능성 있음)
4. **Reading/Listening 모의 문제 렌더러** — JSON 문제 세트를 로드해서 자동 채점
5. **Whisper API 연동** — Speaking 녹음 자동 전사 + AI 채점 (현재는 녹음·재생만 가능)
6. **다국어 토글** — 현재 UI 영문 위주인데 풀 한국어 모드 추가

---

## 절대 하지 말 것

- ❌ 서버/백엔드 도입 (정적 PWA로 유지)
- ❌ 빌드 도구 도입 (Vite, Webpack 등 — 단일 HTML 단순성 유지)
- ❌ 사용자 데이터를 외부로 전송 (프라이버시 원칙)
- ❌ 이모지를 다시 도입 (사용자가 비즈니스 포멀 SVG 아이콘 요구함 — Heroicons outline 스타일 일관성 유지)
- ❌ `<symbol id="i-...">` ID 명명 규칙 변경 (`#i-icon-name` 패턴 유지)
- ❌ Tailwind 색상 팔레트 변경 (brand=indigo-600, 그라데이션 금지)

---

## 사용자(전병탁) 프로필 참고

- 24+ 년 DB HiTek 반도체 엔지니어, 현 INTERX PM/PCB Inspection PO
- Python 사내 강사, AI/머신비전 컨설팅 전문
- 산업통상자원부 장관 표창 (2023, 반도체 AI 기여)
- ADsP 자격, 6 Sigma Black Belt
- 코드 리뷰는 엔지니어링 관점에서 가능 — 짧고 정확한 설명 선호
- 한국어로 답변, 코드는 영문 주석
- TOEFL 96점이 첫 목표. SNU AI 대학원 박사 진학이 최종 목표

---

## 변경 이력

- **2026-05-25**: 초기 버전 작성. Phase 0~4 (26주) 계획 + PWA + 자동 배포 + 오프라인 + 모바일 보강 완료
