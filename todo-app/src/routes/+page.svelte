<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import type { PageData } from './$types';

  export let data: PageData;

  let newTodoText = '';
  let isAdding = false;

  async function addTodo() {
    if (!newTodoText.trim() || isAdding) return;

    isAdding = true;
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: newTodoText })
      });

      if (response.ok) {
        newTodoText = '';
        await invalidateAll();
      }
    } catch (error) {
      console.error('Failed to add todo:', error);
    } finally {
      isAdding = false;
    }
  }

  async function toggleTodo(id: number, completed: boolean) {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completed: !completed })
      });

      if (response.ok) {
        await invalidateAll();
      }
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  }

  async function deleteTodo(id: number) {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await invalidateAll();
      }
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      addTodo();
    }
  }

  $: activeTodos = data.todos.filter(todo => !todo.completed);
  $: completedTodos = data.todos.filter(todo => todo.completed);
</script>

<svelte:head>
  <title>Todo App - Svelte + SQLite</title>
</svelte:head>

<div class="container">
  <h1>📝 Todo App</h1>
  <p class="subtitle">Svelte + SQLite로 만든 할일 관리 앱</p>

  <div class="input-container">
    <input
      type="text"
      bind:value={newTodoText}
      on:keydown={handleKeydown}
      placeholder="새로운 할일을 입력하세요..."
      disabled={isAdding}
    />
    <button on:click={addTodo} disabled={!newTodoText.trim() || isAdding}>
      {isAdding ? '추가 중...' : '추가'}
    </button>
  </div>

  <div class="stats">
    <span>전체: {data.todos.length}개</span>
    <span>완료: {completedTodos.length}개</span>
    <span>진행 중: {activeTodos.length}개</span>
  </div>

  {#if data.todos.length === 0}
    <div class="empty-state">
      <p>아직 할일이 없습니다. 새로운 할일을 추가해보세요! 🚀</p>
    </div>
  {:else}
    <div class="todos-section">
      {#if activeTodos.length > 0}
        <h2>진행 중 ({activeTodos.length})</h2>
        <ul class="todo-list">
          {#each activeTodos as todo (todo.id)}
            <li class="todo-item">
              <input
                type="checkbox"
                id="todo-{todo.id}"
                checked={todo.completed}
                on:change={() => toggleTodo(todo.id, todo.completed)}
              />
              <label for="todo-{todo.id}" class:completed={todo.completed}>
                {todo.text}
              </label>
              <button class="delete-btn" on:click={() => deleteTodo(todo.id)}>
                🗑️
              </button>
            </li>
          {/each}
        </ul>
      {/if}

      {#if completedTodos.length > 0}
        <h2>완료됨 ({completedTodos.length})</h2>
        <ul class="todo-list">
          {#each completedTodos as todo (todo.id)}
            <li class="todo-item">
              <input
                type="checkbox"
                id="todo-{todo.id}"
                checked={todo.completed}
                on:change={() => toggleTodo(todo.id, todo.completed)}
              />
              <label for="todo-{todo.id}" class:completed={todo.completed}>
                {todo.text}
              </label>
              <button class="delete-btn" on:click={() => deleteTodo(todo.id)}>
                🗑️
              </button>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  {/if}
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
  }

  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
    min-height: 100vh;
  }

  h1 {
    color: white;
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  }

  .subtitle {
    color: rgba(255, 255, 255, 0.9);
    text-align: center;
    margin-bottom: 2rem;
    font-size: 1rem;
  }

  .input-container {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  input[type="text"] {
    flex: 1;
    padding: 0.875rem 1rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.2s;
  }

  input[type="text"]:focus {
    outline: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  button {
    padding: 0.875rem 1.5rem;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  button:hover:not(:disabled) {
    background: #45a049;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  button:active:not(:disabled) {
    transform: translateY(0);
  }

  button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .stats {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
    color: white;
    font-size: 0.9rem;
    font-weight: 500;
  }

  .stats span {
    background: rgba(255, 255, 255, 0.2);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    backdrop-filter: blur(10px);
  }

  .empty-state {
    background: white;
    padding: 3rem 2rem;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .empty-state p {
    color: #666;
    font-size: 1.1rem;
    margin: 0;
  }

  .todos-section {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  h2 {
    color: #333;
    font-size: 1.2rem;
    margin-bottom: 1rem;
    margin-top: 1.5rem;
  }

  h2:first-child {
    margin-top: 0;
  }

  .todo-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .todo-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem;
    border-bottom: 1px solid #eee;
    transition: background 0.2s;
  }

  .todo-item:last-child {
    border-bottom: none;
  }

  .todo-item:hover {
    background: #f8f9fa;
  }

  input[type="checkbox"] {
    width: 20px;
    height: 20px;
    cursor: pointer;
    accent-color: #667eea;
  }

  label {
    flex: 1;
    cursor: pointer;
    font-size: 1rem;
    color: #333;
    user-select: none;
  }

  label.completed {
    text-decoration: line-through;
    color: #999;
  }

  .delete-btn {
    padding: 0.5rem;
    background: transparent;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.2s, transform 0.1s;
    box-shadow: none;
  }

  .delete-btn:hover {
    opacity: 1;
    transform: scale(1.1);
    background: transparent;
  }
</style>
