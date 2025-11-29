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

export function buildWeekText(notes: { date: string; text: string }[]): string {
  const grouped: Record<string, string[]> = {};
  for (const note of notes) {
    if (!grouped[note.date]) {
      grouped[note.date] = [];
    }
    grouped[note.date].push(note.text);
  }

  let content = "";
  for (const date of Object.keys(grouped).sort()) {
    const d = new Date(date);
    content += `--- ${formatDay(d)} ---\n`;
    for (const text of grouped[date]) {
      content += `- ${text}\n`;
    }
    content += "\n";
  }

  return content;
}
