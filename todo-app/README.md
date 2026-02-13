# 📝 Todo App - Svelte + SQLite

Svelte와 SQLite를 사용한 풀스택 할일 관리 애플리케이션입니다.

## 🚀 기술 스택

- **Frontend**: SvelteKit, TypeScript
- **Backend**: SvelteKit API Routes
- **Database**: SQLite (better-sqlite3)

## ✨ 주요 기능

- ✅ 할일 추가, 완료, 삭제
- 📊 진행 중 / 완료된 할일 구분
- 💾 SQLite 데이터베이스에 영구 저장
- 🎨 모던하고 반응형 UI
- ⚡ 빠른 성능과 실시간 업데이트

## 📦 설치 및 실행

### 1. 의존성 설치
\`\`\`bash
npm install
\`\`\`

### 2. 개발 서버 실행
\`\`\`bash
npm run dev
\`\`\`

브라우저에서 http://localhost:5173 접속

### 3. 프로덕션 빌드
\`\`\`bash
npm run build
npm run preview
\`\`\`

## 📁 프로젝트 구조

\`\`\`
todo-app/
├── src/
│   ├── lib/
│   │   └── db.ts              # SQLite 데이터베이스 설정 및 쿼리 함수
│   └── routes/
│       ├── api/
│       │   └── todos/
│       │       ├── +server.ts         # GET, POST API
│       │       └── [id]/
│       │           └── +server.ts     # PATCH, DELETE API
│       ├── +page.svelte               # 메인 UI
│       └── +page.server.ts            # 서버 데이터 로드
├── todos.db                   # SQLite 데이터베이스 파일 (자동 생성)
└── package.json
\`\`\`

## 🔧 API 엔드포인트

### GET /api/todos
모든 할일 목록을 가져옵니다.

### POST /api/todos
새로운 할일을 추가합니다.
\`\`\`json
{
  "text": "새로운 할일"
}
\`\`\`

### PATCH /api/todos/[id]
할일의 완료 상태를 업데이트합니다.
\`\`\`json
{
  "completed": true
}
\`\`\`

### DELETE /api/todos/[id]
할일을 삭제합니다.

## 🗄️ 데이터베이스 스키마

\`\`\`sql
CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
\`\`\`

## 🎯 학습 포인트

이 프로젝트에서는 다음을 배울 수 있습니다:

1. **SvelteKit 기본**
   - 파일 기반 라우팅
   - Server Load Functions
   - API Routes

2. **데이터베이스 연동**
   - SQLite 설정 및 사용
   - CRUD 작업 구현

3. **상태 관리**
   - `invalidateAll()`을 통한 데이터 재조회
   - 반응형 상태 업데이트

4. **UI/UX**
   - 반응형 디자인
   - 로딩 상태 처리
   - 사용자 피드백

## 📝 라이센스

MIT
