# Svelte Tutorial

> SvelteKit 기반 Todo 앱 프로젝트로 Svelte의 핵심 문법을 학습합니다.

## 📚 Svelte 핵심 문법 정리

### 1. 반응성 (Reactivity)

#### 기본 반응형 변수
```svelte
<script>
  let count = 0;  // 변수 선언만으로 반응형

  function increment() {
    count += 1;  // 값 변경 시 자동으로 UI 업데이트
  }
</script>

<button on:click={increment}>Count: {count}</button>
```

#### 반응형 구문 ($:)
```svelte
<script>
  let todos = [];

  // 자동으로 재계산되는 반응형 변수
  $: activeTodos = todos.filter(todo => !todo.completed);
  $: completedCount = todos.filter(todo => todo.completed).length;
</script>
```

### 2. 데이터 바인딩

#### 양방향 바인딩 (bind:)
```svelte
<script>
  let name = '';
  let checked = false;
</script>

<input type="text" bind:value={name} />
<input type="checkbox" bind:checked />
```

### 3. 이벤트 핸들링

```svelte
<script>
  function handleClick() {
    console.log('clicked!');
  }

  function handleKeydown(event) {
    if (event.key === 'Enter') {
      // Enter 키 처리
    }
  }
</script>

<button on:click={handleClick}>Click</button>
<input on:keydown={handleKeydown} />
```

### 4. 조건부 렌더링

```svelte
{#if condition}
  <p>조건이 true일 때</p>
{:else if otherCondition}
  <p>다른 조건</p>
{:else}
  <p>모든 조건이 false일 때</p>
{/if}
```

### 5. 리스트 렌더링

```svelte
<script>
  let items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' }
  ];
</script>

{#each items as item (item.id)}
  <div>{item.name}</div>
{/each}
```

### 6. 클래스 바인딩

```svelte
<script>
  let isActive = true;
</script>

<!-- 조건부 클래스 -->
<div class:active={isActive}>Content</div>

<!-- 여러 클래스 -->
<div class="base" class:active class:disabled={!enabled}>
  Content
</div>
```

### 7. 비동기 처리 (Async/Await)

```svelte
<script>
  async function fetchData() {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  }
</script>

{#await fetchData()}
  <p>로딩 중...</p>
{:then data}
  <p>데이터: {data}</p>
{:catch error}
  <p>에러: {error.message}</p>
{/await}
```

### 8. 스타일링

```svelte
<div class="container">
  <h1>Title</h1>
</div>

<style>
  /* 컴포넌트 스코프 스타일 (자동으로 격리됨) */
  .container {
    padding: 2rem;
  }

  h1 {
    color: blue;
  }

  /* 전역 스타일 */
  :global(body) {
    margin: 0;
  }
</style>
```

### 9. 컴포넌트 Props

```svelte
<!-- Child.svelte -->
<script>
  export let title;      // 필수 prop
  export let count = 0;  // 기본값이 있는 optional prop
</script>

<h2>{title}</h2>
<p>Count: {count}</p>

<!-- Parent.svelte -->
<script>
  import Child from './Child.svelte';
</script>

<Child title="Hello" count={5} />
```

### 10. TypeScript 지원

```svelte
<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;

  let count: number = 0;

  function increment(): void {
    count += 1;
  }
</script>
```

---

## 🚀 SvelteKit 핵심 개념

### 1. 파일 기반 라우팅

```
src/routes/
├── +page.svelte          → /
├── about/
│   └── +page.svelte      → /about
├── blog/
│   ├── +page.svelte      → /blog
│   └── [slug]/
│       └── +page.svelte  → /blog/:slug (동적 라우트)
└── api/
    └── todos/
        └── +server.ts    → /api/todos (API 엔드포인트)
```

### 2. Load Functions (데이터 로딩)

#### Server Load Function (+page.server.ts)
```typescript
// 서버에서만 실행 (민감한 정보 처리 가능)
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const data = await fetchFromDatabase();
  return {
    items: data
  };
};
```

#### Universal Load Function (+page.ts)
```typescript
// 서버와 클라이언트 양쪽에서 실행 가능
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
  const response = await fetch(`/api/data/${params.id}`);
  return {
    data: await response.json()
  };
};
```

### 3. API Routes (+server.ts)

```typescript
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// GET 요청
export const GET: RequestHandler = async () => {
  const data = await getData();
  return json(data);
};

// POST 요청
export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const result = await createItem(body);
  return json(result, { status: 201 });
};

// PATCH 요청
export const PATCH: RequestHandler = async ({ params, request }) => {
  const id = params.id;
  const body = await request.json();
  const result = await updateItem(id, body);
  return json(result);
};

// DELETE 요청
export const DELETE: RequestHandler = async ({ params }) => {
  await deleteItem(params.id);
  return json({ success: true });
};
```

### 4. Layout (+layout.svelte)

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import Header from '$lib/Header.svelte';
  import Footer from '$lib/Footer.svelte';
</script>

<Header />
<main>
  <slot />  <!-- 자식 페이지가 여기에 렌더링됨 -->
</main>
<Footer />

<style>
  main {
    padding: 2rem;
  }
</style>
```

### 5. Layout 그룹 및 고급 라우팅

```
src/routes/
├── (auth)/              → 괄호: URL에 포함되지 않는 레이아웃 그룹
│   ├── +layout.svelte
│   ├── login/
│   │   └── +page.svelte  → /login
│   └── register/
│       └── +page.svelte  → /register
├── +page@.svelte        → @ 뒤: 특정 레이아웃 사용 (여기서는 루트)
└── docs/
    └── [...slug]/       → ... : 나머지 모든 경로 매칭
        └── +page.svelte  → /docs/any/path/here
```

### 6. Navigation (페이지 이동)

```svelte
<script>
  import { goto } from '$app/navigation';
  import { invalidateAll } from '$app/navigation';

  async function handleSubmit() {
    await submitData();

    // 프로그래매틱 네비게이션
    goto('/success');

    // 또는 데이터 다시 로드
    await invalidateAll();
  }
</script>

<!-- 선언적 네비게이션 -->
<a href="/about">About</a>
```

### 7. $lib 별칭

```svelte
<script>
  // src/lib/components/Button.svelte를 간단하게 import
  import Button from '$lib/components/Button.svelte';
  import { helper } from '$lib/utils.ts';
</script>
```

### 8. Error Handling

```svelte
<!-- src/routes/+error.svelte -->
<script>
  import { page } from '$app/stores';
</script>

<h1>{$page.status}: {$page.error.message}</h1>
```

```typescript
// +page.server.ts에서 에러 던지기
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
  const item = await getItem(params.id);

  if (!item) {
    throw error(404, 'Not found');
  }

  return { item };
};
```

### 9. Preloading (성능 최적화)

```html
<!-- app.html 또는 특정 링크에서 -->
<a href="/products" data-sveltekit-preload-data="hover">
  Products
</a>

<!-- 옵션: hover, tap, off -->
<!-- hover: 마우스 오버 시 데이터 미리 로드 -->
```

### 10. 실용 예제 - Todo App 구조

```
todo-app/
├── src/
│   ├── lib/
│   │   └── db.ts              # 데이터베이스 로직
│   └── routes/
│       ├── +page.svelte       # 메인 UI
│       ├── +page.server.ts    # 서버 데이터 로드
│       └── api/
│           └── todos/
│               ├── +server.ts        # GET, POST
│               └── [id]/
│                   └── +server.ts    # PATCH, DELETE
```
