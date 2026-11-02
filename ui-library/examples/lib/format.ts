// Every number and date on screen goes through Intl, once, here. Units are joined with a
// non-breaking space so "212 °C" never wraps between figure and unit.

const NBSP = " ";
const locale = "en-GB";

export const integer = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
export const clock = new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" });
export const day = new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long" });
export const shortDay = new Intl.DateTimeFormat(locale, { weekday: "short", hour: "2-digit", minute: "2-digit" });

export const celsius = (value: number) => `${integer.format(value)}${NBSP}°C`;
export const withUnit = (value: number, unit: string) => `${integer.format(value)}${NBSP}${unit}`;
