const WEEKDAY_NAMES = [
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六",
  "星期日",
];

const WEEKDAY_SHORT = ["一", "二", "三", "四", "五", "六", "日"];

export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseDateKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function startOfWeek(date: Date): Date {
  const index = (date.getDay() + 6) % 7;
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  start.setDate(start.getDate() - index);
  return start;
}

export function weekDates(date: Date): Date[] {
  const start = startOfWeek(date);
  return Array.from({ length: 7 }, (_, i) => {
    const next = new Date(start);
    next.setDate(start.getDate() + i);
    return next;
  });
}

export function formatChineseDate(date: Date): string {
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

export function weekdayName(date: Date): string {
  return WEEKDAY_NAMES[(date.getDay() + 6) % 7];
}

export function formatFullDate(date: Date): string {
  return `${date.getFullYear()}年${formatChineseDate(date)} ${weekdayName(date)}`;
}

export function weekdayShort(date: Date): string {
  return WEEKDAY_SHORT[(date.getDay() + 6) % 7];
}

export function isSameDay(a: Date, b: Date): boolean {
  return toDateKey(a) === toDateKey(b);
}

export function today(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}
