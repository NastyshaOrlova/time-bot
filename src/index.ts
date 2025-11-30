import { Telegraf, Input } from "telegraf";
import "dotenv/config";
import { saveNote, getNotes } from "./db";
import { buildWeekText } from "./utils/exportWeek";
import { startScheduler } from "./scheduler";

const bot = new Telegraf(process.env.BOT_TOKEN!);

// Форматируем дату в "Понедельник 02.12"
function formatDay(date: Date): string {
  const days = [
    "Воскресенье",
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
  ];
  const day = days[date.getDay()];
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${day} ${dd}.${mm}`;
}

bot.command("start", (ctx) => {
  ctx.reply(formatDay(new Date()));
  ctx.reply("✨Твои мысли и заметки о самом важном:");
});

bot.command("week", async (ctx) => {
  const chatId = ctx.chat.id;
  const notes = getNotes(chatId, 7) as { date: string; text: string }[];

  if (notes.length === 0) {
    return ctx.reply("Нет заметок за последние 7 дней");
  }

  const content = buildWeekText(notes);
  const buffer = Buffer.from(content, "utf-8");
  await ctx.replyWithDocument(Input.fromBuffer(buffer, "week.txt"));
});

bot.on("text", (ctx) => {
  const chatId = ctx.chat.id;
  const text = ctx.message.text;
  const date = new Date().toISOString().split("T")[0];

  saveNote(chatId, date, text);
});

startScheduler(bot, 720410021);

bot.launch();
console.log("Бот запущен!");
