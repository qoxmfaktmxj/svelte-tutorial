import { json } from '@sveltejs/kit';
import { getAllTodos, createTodo } from '$lib/db';
import type { RequestHandler } from './$types';

// GET - 모든 할일 가져오기
export const GET: RequestHandler = async () => {
  try {
    const todos = getAllTodos();
    return json(todos);
  } catch (error) {
    return json({ error: 'Failed to fetch todos' }, { status: 500 });
  }
};

// POST - 새 할일 생성
export const POST: RequestHandler = async ({ request }) => {
  try {
    const { text } = await request.json();

    if (!text || text.trim() === '') {
      return json({ error: 'Text is required' }, { status: 400 });
    }

    const newTodo = createTodo(text.trim());
    return json(newTodo, { status: 201 });
  } catch (error) {
    return json({ error: 'Failed to create todo' }, { status: 500 });
  }
};
