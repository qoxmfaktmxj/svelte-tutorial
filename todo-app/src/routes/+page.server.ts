import { getAllTodos } from '$lib/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const todos = getAllTodos();
  return {
    todos
  };
};
