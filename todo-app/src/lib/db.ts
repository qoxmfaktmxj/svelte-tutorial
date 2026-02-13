import Database from 'better-sqlite3';
import { join } from 'path';

const db = new Database(join(process.cwd(), 'todos.db'));

// Create todos table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    completed BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  created_at: string;
}

export function getAllTodos(): Todo[] {
  const stmt = db.prepare('SELECT * FROM todos ORDER BY created_at DESC');
  return stmt.all() as Todo[];
}

export function createTodo(text: string): Todo {
  const stmt = db.prepare('INSERT INTO todos (text) VALUES (?)');
  const info = stmt.run(text);
  return getTodoById(info.lastInsertRowid as number)!;
}

export function getTodoById(id: number): Todo | undefined {
  const stmt = db.prepare('SELECT * FROM todos WHERE id = ?');
  return stmt.get(id) as Todo | undefined;
}

export function updateTodo(id: number, completed: boolean): Todo | undefined {
  const stmt = db.prepare('UPDATE todos SET completed = ? WHERE id = ?');
  stmt.run(completed ? 1 : 0, id);
  return getTodoById(id);
}

export function deleteTodo(id: number): void {
  const stmt = db.prepare('DELETE FROM todos WHERE id = ?');
  stmt.run(id);
}

export default db;
