# TOEFL 100 Trainer

> 서울대 AI 대학원 박사 진학을 위한 6개월 토플 100점 도전 트레이너.
> 단일 페이지 PWA. 오프라인 동작. 데이터는 모두 기기 로컬에만 저장됨.

**Live demo:** `https://btjeon.github.io/toefl-trainer/`

---

## 기능

- **Dashboard** — 일일/주간 학습량, 연속 학습 스트릭, 26주 Phase 진도
- **Vocabulary** — SM-2 간격 반복(SRS), Academic Word List 시드 50개, CSV 일괄 가져오기
- **Speaking** — TOEFL 4과제 타이머(준비/답변) + 마이크 녹음 + IndexedDB 영구 저장
- **Shadowing** — 로컬 오디오 또는 YouTube + 자막 라인별 점프 + 구간 반복 + 0.5~1.5× 속도
- **Settings** — 시작일·목표 점수·일일 목표 설정, JSON 백업/복원, 전체 초기화

## 기술 스택

- 순수 HTML + JavaScript (빌드 도구 없음)
- Tailwind CSS via CDN
- IndexedDB (오디오 blob) + localStorage (메타데이터)
- Service Worker (오프라인 캐시)
- Web App Manifest (홈 화면 설치)

## 데이터 프라이버시

이 앱은 **서버를 사용하지 않습니다**. 모든 학습 기록과 음성 녹음은 사용자 기기의 브라우저 안에만 저장됩니다. GitHub Pages는 정적 HTML/JS/CSS만 호스팅하며, 사용자 데이터는 어디로도 전송되지 않습니다.

---

## 배포 가이드 (GitHub Pages)

### 1단계 — 새 레포 생성

GitHub 웹에서 새 레포 `toefl-trainer` 생성 (Public).

### 2단계 — 로컬에서 첫 푸시

```bash
cd "C:\Users\gogot\OneDrive\문서\Claude\Projects\영어공부\toefl-trainer"

git init
git add .
git commit -m "Initial commit: TOEFL 100 Trainer"
git branch -M main
git remote add origin https://github.com/btjeon/toefl-trainer.git
git push -u origin main
```

### 3단계 — GitHub Pages 활성화

레포 → **Settings** → **Pages** →
- Source: **GitHub Actions** 선택

자동으로 `.github/workflows/deploy.yml`이 감지되어 첫 배포가 시작됩니다.
완료 후 `https://btjeon.github.io/toefl-trainer/` 로 접속.

### 4단계 — 배포 확인

- Actions 탭에서 워크플로 성공 확인 (보통 1~2분 소요)
- 브라우저에서 위 URL 접속
- 마이크 권한 요청 시 허용

### 이후 업데이트

```bash
# 코드 수정 후
git add .
git commit -m "Update: <변경사항>"
git push
```
→ GitHub Actions가 자동으로 재배포.

---

## 스마트폰에서 사용하기

### iOS (Safari)

1. 사파리로 `https://btjeon.github.io/toefl-trainer/` 접속
2. 하단 **공유 버튼** → **"홈 화면에 추가"**
3. 홈 화면 아이콘 탭 → 풀스크린 앱처럼 실행
4. 마이크 권한 요청 시 허용 (Speaking 녹음용)

> ⚠️ iOS Safari는 IndexedDB 용량이 약 1GB로 제한됩니다. 녹음을 많이 모으면 오래된 것부터 정리하세요.

### Android (Chrome)

1. 크롬으로 같은 URL 접속
2. 주소창 우측 **설치 아이콘** 또는 메뉴 → **"앱 설치"**
3. 홈 화면 아이콘 탭 → standalone 앱으로 실행
4. 마이크 권한 요청 시 허용

### 다크 모드

OS 다크 모드와 별개로, 헤더 우상단 달/해 아이콘으로 토글 가능. 설정은 기기별로 저장됨.

---

## 파일 구조

```
toefl-trainer/
├── index.html                   # 메인 앱 (단일 파일)
├── manifest.json                # PWA 매니페스트
├── sw.js                        # 서비스 워커 (오프라인 캐시)
├── icon-192.png                 # PWA 아이콘 192×192
├── icon-512.png                 # PWA 아이콘 512×512
├── icon-maskable-512.png        # Android adaptive icon
├── apple-touch-icon.png         # iOS 홈 화면 아이콘 180×180
├── favicon-32.png               # 브라우저 탭 아이콘
├── README.md                    # 이 파일
└── .github/
    └── workflows/
        └── deploy.yml           # GitHub Pages 자동 배포
```

---

## 로컬 개발 (선택)

빌드 없이도 동작하지만, 서비스 워커는 `file://`에서 동작하지 않습니다. 로컬 테스트 시:

```bash
cd toefl-trainer
python -m http.server 8000
# → http://localhost:8000
```

---

## 알려진 제약

- **YouTube Error 153** — 영상 업로더가 임베드 차단한 경우 발생. 폴백 패널의 "YouTube에서 열기" 링크로 새 탭에서 시청 가능
- **Speaking 녹음 크기** — 60초 webm 약 500KB. IndexedDB 용량 관리 필요 시 Settings → 전체 초기화 또는 개별 삭제
- **HTTPS 필수** — 마이크 녹음은 `https://` 또는 `localhost`에서만 동작 (GitHub Pages는 자동 HTTPS)
- **iOS Safari MediaRecorder** — iOS 14.5+ 필요

---

## 라이선스

개인 학습용. 자유 사용/수정.

---

*v1.0 · Created May 2026*
