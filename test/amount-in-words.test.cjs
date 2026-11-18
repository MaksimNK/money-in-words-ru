const assert = require('node:assert/strict');
const { test } = require('node:test');
const { amountInWords } = require('money-in-words-ru');

const cases = {
  BYN: [
    ['0', 'Ноль белорусских рублей ноль копеек'],
    ['1.01', 'Один белорусский рубль одна копейка'],
    ['2.02', 'Два белорусских рубля две копейки'],
    ['5.05', 'Пять белорусских рублей пять копеек'],
    ['11.14', 'Одиннадцать белорусских рублей четырнадцать копеек'],
    ['21.22', 'Двадцать один белорусский рубль двадцать две копейки'],
    ['275.00', 'Двести семьдесят пять белорусских рублей ноль копеек'],
    ['-1.005', 'Минус один белорусский рубль одна копейка'],
    ['1.004999999999999999999', 'Один белорусский рубль ноль копеек'],
    ['1.995', 'Два белорусских рубля ноль копеек'],
    ['-0.005', 'Минус ноль белорусских рублей одна копейка'],
    ['-0.004', 'Ноль белорусских рублей ноль копеек'],
  ],
  USD: [
    ['0', 'Ноль долларов США ноль центов'],
    ['1.01', 'Один доллар США один цент'],
    ['2.02', 'Два доллара США два цента'],
    ['5.05', 'Пять долларов США пять центов'],
    ['14.11', 'Четырнадцать долларов США одиннадцать центов'],
    ['22.21', 'Двадцать два доллара США двадцать один цент'],
    ['-1.005', 'Минус один доллар США один цент'],
    ['1.004999999999999999999', 'Один доллар США ноль центов'],
    ['1.995', 'Два доллара США ноль центов'],
    ['-0.005', 'Минус ноль долларов США один цент'],
    ['-0.004', 'Ноль долларов США ноль центов'],
  ],
};

for (const [currency, examples] of Object.entries(cases)) {
  test(currency, () => {
    for (const [amount, expected] of examples) {
      assert.equal(amountInWords(amount, currency), expected, amount);
    }
  });
}

test('uses feminine thousands and exact large integers', () => {
  assert.equal(
    amountInWords('+000002002.1', 'BYN'),
    'Две тысячи два белорусских рубля десять копеек',
  );
  assert.equal(
    amountInWords('1000000000000000001.01', 'USD'),
    'Один квинтиллион один доллар США один цент',
  );
});

test('rejects unsupported currencies and malformed amounts', () => {
  for (const code of ['XXX', 'byn', 'toString', '']) {
    assert.throws(() => amountInWords('1', code), { name: 'RangeError', message: /Unsupported currency/ });
  }
  for (const amount of ['', '1\n', ' 1', '1,00', '1e3', 'NaN', '.5', '1.', '--1', 1, null]) {
    assert.throws(() => amountInWords(amount, 'BYN'), { name: 'TypeError', message: /Invalid amount/ });
  }
});

test('rejects out-of-range amounts including rounding overflow', () => {
  for (const amount of ['1000000000000000000000', '999999999999999999999.995']) {
    assert.throws(() => amountInWords(amount, 'USD'), { name: 'RangeError', message: /magnitude/ });
  }
});

test('all requested currencies support zero, plurals, negatives and rounding', () => {
  const codes = 'BYN AUD GBP HUF DKK USD EUR ILS ISK CAD NZD NOK PLN TRY CZK SEK CHF JPY AZN ALL DZD ARS AMD AFN BGN BRL VES VND HKD GEL AED EGP INR IDR JOD IQD IRR KZT KES CNY COP KWD KGS LAK LBP LTL MKD MYR MAD MXN RUB'.split(' ');
  const definitions = require('../src/currencies.json');
  assert.deepEqual(Object.keys(definitions).sort(), codes.sort());
  for (const code of codes) {
    const { decimals, major, minor } = definitions[code];
    for (const [number, form] of [[0, 2], [1, 0], [2, 1], [5, 2], [11, 2], [21, 0]]) {
      assert.ok(amountInWords(String(number), code).includes(major.forms[form]), code);
      if (minor) {
        const fraction = String(number).padStart(decimals, '0');
        if (fraction.length <= decimals) {
          assert.ok(amountInWords('0.' + fraction, code).endsWith(minor.forms[form]), code);
        }
      }
    }
    assert.ok(amountInWords('-1', code).startsWith('Минус '), code);
    const half = '0.' + '0'.repeat(decimals) + '5';
    const rounded = decimals ? '0.' + '0'.repeat(decimals - 1) + '1' : '1';
    assert.equal(amountInWords(half, code), amountInWords(rounded, code), code);
  }
});
