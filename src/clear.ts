import db from "./db";

db.exec("DELETE FROM notes");
console.log("База очищена!");
