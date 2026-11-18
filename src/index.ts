import { currencies } from './currencies.js';
import { formatUnit, integerLimit, minus } from './russian.js';

export function amountInWords(amount: string, currency: string): string {
  const definition = currencies.get(currency);
  if (!definition) throw new RangeError('Unsupported currency code');

  const parts = typeof amount === 'string' && /^([+-]?)([0-9]+)(?:\.([0-9]+))?(?![\s\S])/.exec(amount);
  if (!parts) throw new TypeError('Invalid amount: expected a decimal string');

  const [, sign, integerPart, fraction = ''] = parts;
  const { decimals, major, minor } = definition;
  const digits = integerPart.replace(/^0+/, '');
  if (digits.length >= integerLimit.toString().length) {
    throw new RangeError('Amount exceeds the supported magnitude');
  }

  const factor = 10n ** BigInt(decimals);
  const retained = fraction.slice(0, decimals).padEnd(decimals, '0');
  let units = BigInt(digits) * factor + BigInt(retained);
  if (fraction[decimals] >= '5') units += 1n;

  const majorValue = units / factor;
  if (majorValue >= integerLimit) throw new RangeError('Amount exceeds the supported magnitude');

  const words = formatUnit(majorValue, major);
  const prefix = sign === '-' && units !== 0n ? minus + ' ' : '';
  const suffix = minor ? ' ' + formatUnit(units % factor, minor) : '';
  const result = prefix + words + suffix;
  return result[0].toUpperCase() + result.slice(1);
}
