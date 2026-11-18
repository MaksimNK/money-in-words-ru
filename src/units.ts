export type Gender = 'masculine' | 'feminine' | 'neuter';

export interface Unit {
  readonly gender: Gender;
  readonly forms: readonly [one: string, few: string, many: string];
}

export type UnitData = { gender: string; forms: string[] };

export function isUnit(unit: UnitData): unit is UnitData & Unit {
  const { gender, forms } = unit;
  return (gender === 'masculine' || gender === 'feminine' || gender === 'neuter')
    && forms.length === 3 && forms.every(form => form.trim().length > 0);
}
