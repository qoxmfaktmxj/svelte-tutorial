import { json } from '@sveltejs/kit';
import { updateTodo, deleteTodo } from '$lib/db';
import type { RequestHandler } from './$types';

// PATCH - 할일 상태 업데이트
export const PATCH: RequestHandler = async ({ params, request }) => {
  try {
    const id = parseInt(params.id);
    const { completed } = await request.json();

    if (isNaN(id)) {
      return json({ error: 'Invalid ID' }, { status: 400 });
    }

    const updatedTodo = updateTodo(id, completed);

    if (!updatedTodo) {
      return json({ error: 'Todo not found' }, { status: 404 });
    }

    return json(updatedTodo);
  } catch (error) {
    return json({ error: 'Failed to update todo' }, { status: 500 });
  }
};

// DELETE - 할일 삭제
export const DELETE: RequestHandler = async ({ params }) => {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return json({ error: 'Invalid ID' }, { status: 400 });
    }

    deleteTodo(id);
    return json({ success: true });
  } catch (error) {
    return json({ error: 'Failed to delete todo' }, { status: 500 });
  }
};
