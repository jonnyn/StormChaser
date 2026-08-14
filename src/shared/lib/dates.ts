const defaultOptions: Intl.DateTimeFormatOptions = {
  dateStyle: 'medium',
  timeStyle: 'short',
};

export function formatDateTime(iso: string, locale = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, defaultOptions).format(new Date(iso));
}

/** Formats an Open-Meteo daily `YYYY-MM-DD` as a short weekday in local time. */
export function formatWeekday(dateYmd: string, locale = 'en-US'): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateYmd);
  if (!match) {
    return dateYmd;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date);
}

/** Formats an Open-Meteo hourly local timestamp as a short hour label. */
export function formatHourLabel(time: string, locale = 'en-US'): string {
  const parsed = new Date(time);
  if (Number.isNaN(parsed.getTime())) {
    const hourMatch = /T(\d{2})/.exec(time);
    return hourMatch ? `${Number(hourMatch[1])}` : time;
  }

  return new Intl.DateTimeFormat(locale, { hour: 'numeric' }).format(parsed);
}
