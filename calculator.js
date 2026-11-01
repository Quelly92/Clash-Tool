// Whole input minutes are converted to seconds; rounding happens only for display.
export const LIMIT = 1000000;
export function whole(value) {
  if (!/^\d*$/.test(String(value))) throw new Error('Use whole numbers from 0 to 1,000,000.');
  const number = value === '' ? 0 : Number(value);
  if (!Number.isSafeInteger(number) || number > LIMIT) throw new Error('Use whole numbers from 0 to 1,000,000.');
  return number;
}
export function calculate(days, hours, minutes, potions, rate) {
  if (![10, 24].includes(rate)) throw new Error('Unknown potion.');
  const total = whole(days) * 86400 + whole(hours) * 3600 + whole(minutes) * 60;
  const boost = whole(potions) * 3600;
  const completion = total <= rate * boost ? total / rate : total - (rate - 1) * boost;
  return {total, completion, saved: total - completion};
}
export function format(seconds) {
  // Inputs in minutes yield exact whole or half seconds for these two rates.
  let halfSeconds = Math.round(seconds * 2);
  const parts = [];
  for (const [unit, size] of [['d',172800],['h',7200],['m',120],['s',2]]) {
    const amount = unit === 's' ? halfSeconds / 2 : Math.floor(halfSeconds / size);
    if (amount) parts.push(`${amount}${unit}`);
    halfSeconds %= size;
  }
  return parts.join(' ') || '0s';
}
