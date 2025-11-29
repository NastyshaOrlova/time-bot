import cron from "node-cron";
import { Telegraf } from "telegraf";

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

export function startScheduler(bot: Telegraf, chatId: number) {
  cron.schedule("1 0 * * *", () => {
    bot.telegram.sendMessage(chatId, formatDay(new Date()));
    console.log("Отправлено сообщение о новом дне");
  });

  console.log("Планировщик запущен");
}
