// Every number and date on screen goes through Intl, once. The formatters are strata-react's
// (`format`, en-GB); this file names the ones the kiln room uses so screens import them plainly.
import { format } from "strata-react";

export const { integer, clock, day, shortDay, celsius } = format;
export const withUnit = (value: number, unit: string) => format.withUnit(value, unit);
