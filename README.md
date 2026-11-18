# money-in-words-ru

Spell monetary amounts in Russian. Supports the 51 currency codes listed below and has no runtime dependencies.

BYN AUD GBP HUF DKK USD EUR ILS ISK CAD NZD NOK PLN TRY CZK SEK CHF JPY AZN ALL DZD ARS AMD AFN BGN BRL VES VND HKD GEL AED EGP INR IDR JOD IQD IRR KZT KES CNY COP KWD KGS LAK LBP LTL MKD MYR MAD MXN RUB.

```ts
import { amountInWords } from 'money-in-words-ru';

amountInWords('275.00', 'BYN');
// Двести семьдесят пять белорусских рублей ноль копеек

amountInWords('-1.005', 'USD');
// Минус один доллар США один цент
```

CommonJS consumers can use `const { amountInWords } = require('money-in-words-ru');`.

Pass an uppercase currency code and a decimal string with at least one integer digit. An optional sign and a fractional part separated by a dot are accepted. Malformed amounts throw `TypeError`. Unsupported currency codes and rounded magnitudes of 10²¹ or more throw `RangeError`.

Currency-specific precision follows ISO 4217, including zero and three decimal places. Rounding is exact, with ties rounded away from zero. The output includes zero-valued units and omits «минус» when the rounded amount is zero.

## Build and package

Use Node.js 18 or later.

```sh
npm ci
npm test
npm pack
```

`npm run build` writes JavaScript and TypeScript declarations to `dist/`. `npm pack` builds again and creates a local tarball you can install with `npm install ./money-in-words-ru-0.1.0.tgz`.

Russian numeral words and scale forms live in `src/russian-numerals.json`.

## Add a currency

Add an entry to `src/currencies.json` with its decimal precision, major and minor unit names, and grammatical gender. Use the singular form after 1, the form after 2–4, and the form after 5–20 or zero. Set `minor` to `null` for currencies without a named minor unit. Add public API examples in `test/amount-in-words.test.cjs` for these forms, zero, negatives, and rounding.

The [ISO 4217 amendment for BYN](https://www.six-group.com/dam/download/financial-information/data-center/iso-currrency/amendments/dl_currency_iso_amendment_161.pdf) specifies two minor-unit digits. The [U.S. Mint](https://kids.usmint.gov/about-the-mint/dollar) lists 100 cents per dollar. Russian declensions are documented in Gramota’s entries for [рубль](https://gramota.ru/meta/rubl), [копейка](https://gramota.ru/meta/kopeyka), [доллар](https://gramota.ru/meta/dollar), and [цент](https://gramota.ru/meta/tsent).
