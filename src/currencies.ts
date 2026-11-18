import definitions = require('./currencies.json');
import { isUnit, type Unit, type UnitData } from './units.js';

interface Currency {
  readonly major: Unit;
  readonly minor: Unit | null;
  readonly decimals: number;
}

const entries: [string, Currency][] = [];
for (const [code, definition] of Object.entries(definitions)) {
  const { decimals, major, minor }: { decimals: number; major: UnitData; minor: UnitData | null } = definition;
  if (!Number.isSafeInteger(decimals) || decimals < 0 || !isUnit(major) || (minor !== null && !isUnit(minor))) {
    throw new Error(`Invalid currency definition for ${code}`);
  }
  entries.push([code, { decimals, major, minor }]);
}

export const currencies: ReadonlyMap<string, Currency> = new Map(entries);
