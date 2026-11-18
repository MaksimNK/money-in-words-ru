import numerals = require('./russian-numerals.json');
import { isUnit, type Gender, type Unit } from './units.js';

const { firstTwo, small, tens, hundreds, zero, minus } = numerals;

if ([firstTwo.masculine, firstTwo.feminine, firstTwo.neuter]
  .some(pair => pair.length !== 2 || pair.some(word => !word.trim()))
  || small.length !== 20 || tens.length !== 10 || hundreds.length !== 10
  || !zero.trim() || !minus.trim()) {
  throw new Error('Invalid Russian numeral tables');
}

const scales = numerals.scales.filter(isUnit);
if (scales.length !== numerals.scales.length) {
  throw new Error('Invalid Russian numeral scale forms');
}

export { minus };

export const integerLimit = 1000n ** BigInt(scales.length + 1);

function unitForm(lastTwo: number, unit: Unit): string {
  if (lastTwo >= 11 && lastTwo <= 14) return unit.forms[2];
  const last = lastTwo % 10;
  if (last === 1) return unit.forms[0];
  if (last >= 2 && last <= 4) return unit.forms[1];
  return unit.forms[2];
}

function tripletWords(value: number, gender: Gender): string {
  const words = [hundreds[Math.floor(value / 100)]];
  let remainder = value % 100;
  if (remainder >= 20) {
    words.push(tens[Math.floor(remainder / 10)]);
    remainder %= 10;
  }
  words.push(remainder === 1 || remainder === 2 ? firstTwo[gender][remainder - 1] : small[remainder]);
  return words.filter(Boolean).join(' ');
}

export function formatUnit(value: bigint, unit: Unit): string {
  const words = [unitForm(Number(value % 100n), unit)];
  if (value === 0n) return zero + ' ' + words[0];

  let remaining = value;
  for (let group = 0; remaining > 0n; group++, remaining /= 1000n) {
    const triplet = Number(remaining % 1000n);
    if (triplet === 0) continue;
    const scale = scales[group - 1];
    if (scale) words.push(unitForm(triplet % 100, scale));
    words.push(tripletWords(triplet, (scale ?? unit).gender));
  }
  return words.reverse().join(' ');
}
