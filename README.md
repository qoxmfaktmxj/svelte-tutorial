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

---

## Svelte 기본적인 문법 배우기 (상세)
### +page.svelte로 화면 생성
### +layout.svelte로 layout 생성
### 각 폴더를 주소로 가져가서 about 폴더면 /about 에 해당 화면 연결
---
### [productId]로 productId를 param으로 받는 동적인 페이지 생성
### params 폴더의 integer.js 를 추가하여 조건을 걸어주고 [productId=integer]로 해당 조건 연결 
#### productId는 intger만 가능
---
### (auth)로 layoutGroup 생성
#### 원래는 /auth/login으로 해야 하지만 auth를 붙이기 싫기 때문에
#### auth를 layoutGroup으로 지정하도록 () 안에 폴더를 생성해줌 
##### 윈도우에서는 vscode 실행 시 관리자권한으로 해주어야 폴더명 변경 가능
---
### +page@(auth).svelte 해당 page는 auth의 레이아웃을 쓸 것임을 명시
### +page@.svelte 는 root의 레이아웃을 사용
---
### Header와 Footer를 lib로 옮긴 후 $lib를 통해 import하여 사용 가능
### Script에 import Header from '$lib/header.svelte'; 로 추가한 후 
### <Header /> 로 사용 <slot /> 을 통해 자식요소를 가져 해당 위치에 +page.svelte가 보여짐
---
### demo-api폴더에 +server.js로 api 생성함 {url}/demo-api 호출 시 값 확인 가능
### @sveltejs/kit으로부터 json 임포트 하면 return json(comments); 가능 (편리)
### API 테스트 위해 VS Code Rest API Client인 Thunder Client Extension 설치 ( or POSTMAN)
### 이후 http://[::]:5173/api/comments 확인 (localhost대신 [::] 사용)
---
### api test GET(조회), POST(저장), PATCH(업데이트) 폴더 comments내 있음
### 구문 확인 const comment = comments.find((comment)=> comment.id === parseInt(commentId));
---
## Section Summary
### File based routing
### Nested routes
### Dynamic routes
### Catch all routes
### Optional parameters
### Anchor tag navigation and navigating programmatically
### Route matchers
### Route layouts, layout groups, breaking out of layouts
### Working with other files
### API Routes to handle GET, POST, PATCH and DELTE requests
---
### 데이터 Loading Test 하기 위해 loading-data 패키지 추가
### db.json 파일 추가 (임시 데이터 생성)
### scripts에 "serve-json" : "json-server --watch db.json --port 4000" 추가
### npm run serve-json으로 서버 시작하여 http://localhost:4000/products 로 db.json 확인
### /address로 dropdown 표기 +page.js의 fetch 참조
### console.log("Load function called in page.server.js") - page.server.js 에서 콘솔부분
### Server 에만 console확인되며, 브라우저의 개발자도구에는 표시되지 않는 것 확인
### 서버로드 함수는 page.server.js 파일에 정의되어 있고 서버에서만 실행됨
### 브라우저에 전달되면 안되는 민감한 정보가 포함된 페이지 작성 시 필요 (Security)
---
## Universal vs Server Load Function
### 둘다 페이지 데이터 로드 
### 하지만 Server Load Function은 브라우저로 코드가 배송되지 않아서 데이터베이스 자격증명 및
### 개인 API 키 등 민감한 정보를 사용하는 코드에 대한 동작이 필요할 때 사용가능
### Universal Load Function은 구성 요소 생성 등 서버로드에서는 사용하지 못하는 것을 반환 가능
### ex)product.svelte에서 Component구성해서 넘길 때 Server Load Function은 사용못함\
---
### error와 redirect 사용
### +error.svelte에 정의하여 error났을때 문구 변경 가능하며, redirect import해서 페이지 변환
### [productId] 내의 +page.server.js 확인
---
## layout data
### products 의 layout.js, layout.svelte 참조. 데이터 불러와서 layout을 만들어서 표시

## Universal Load Function 과 Server Load Function
### params   | params 
### url      | url
### route    | route
### fetch    | fetch
### parent   | parent

## Using Child Data
### http://localhost:5173/products에서 notification http://localhost:5173/products/1에서 
### notification 컨트롤되는 부분 확인 (Child data를 parent component에서 사용)
### <svelte:head>
###    <title>{$page.data.title || '석이석이'} </title>
### </svelte:head>
### 메인 페이지 석이석이 title 존재하는 페이지는 $page.data.title을 타이틀로 가짐

## Refresh Logic 시 invalidation 사용

## app.html data-sveltekit-preload-data="hover" => Server side rendering : localhost:5173 접속 후
## products 커서 반응 시 클릭 안한 상태여도 json데이터 받아옴 (hover, tap ...)
## data-sveltekit-preload-data="off" 로 원하는 곳에만 끌 수 있음
## data-sveltekit-preload-code="hover" json 파일은 못봄 (미리 로드된 데이터 사용해 그림) (eager, viewport ...)

# https://www.youtube.com/watch?v=xyFSbu3hM1g&list=PLC3y8-rFHvwjifDNQYYWI6i06D7PjF0Ua&index=39