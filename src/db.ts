import Database from "better-sqlite3";
import path from "path";

const db = new Database(path.join(__dirname, "..", "notes.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  
    chat_id INTEGER NOT NULL,              
    date TEXT NOT NULL,                    
    text TEXT NOT NULL                     
  )
`);

export function saveNote(chatId: number, date: string, text: string) {
  const stmt = db.prepare(
    "INSERT INTO notes (chat_id, date, text) VALUES (?, ?, ?)"
  );

  stmt.run(chatId, date, text);
}

export function getNotes(chatId: number, days: number = 7) {
  const today = new Date();

  const startDate = new Date();
  startDate.setDate(today.getDate() - days + 1);

  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  const stmt = db.prepare(
    "SELECT date, text FROM notes WHERE chat_id = ? AND date >= ? AND date <= ? ORDER BY date, id"
  );

  return stmt.all(chatId, formatDate(startDate), formatDate(today));
}

export default db;
