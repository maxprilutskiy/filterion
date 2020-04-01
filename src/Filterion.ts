export class Filterion<TFilters = any, TOperators extends FilterionBaseOperators = FilterionBaseOperators> {
  public constructor(
    private _payload: IFilterionPayload<TFilters, TOperators> = {},
  ) { }

  public add<F extends keyof TFilters>(field: F, value: TFilters[F] | TFilters[F][], op: TOperators = DEFAULT_OPERATOR as TOperators): Filterion<TFilters, TOperators> {
    if (this.exists(field, value, op)) { return this; }

    const values = Array.isArray(value) ? value : [value];
    const payloadClone = Filterion.clonePayload(this.payload);

    this.ensureFieldValueNotEmpty(payloadClone, field, op);

    for (const v of values) {
      const valueExists = this.exists(field, v, op);
      if (valueExists) { continue; }

      payloadClone[field][op].push(v);
    }

    return new Filterion<TFilters, TOperators>(payloadClone);
  }

  public remove<F extends keyof TFilters>(field: F, value?: TFilters[F] | TFilters[F][], op: TOperators = DEFAULT_OPERATOR as TOperators): Filterion<TFilters, TOperators> {
    if (!this.exists(field, value, op)) { return this; }

    const values = Array.isArray(value) ? value : [value];
    const payloadClone = Filterion.clonePayload(this.payload);

    this.ensureFieldValueNotEmpty(payloadClone, field, op);

    for (const v of values) {
      const valueExists = this.exists(field, v, op);
      if (!valueExists) { continue; }

      const vIndex = payloadClone[field][op].indexOf(v);
      payloadClone[field][op].splice(vIndex, 1);
    }

    this.ensureFieldValueMeaningfull(payloadClone, field, op);
    return new Filterion<TFilters, TOperators>(payloadClone);
  }

  public get payload() {
    return this._payload;
  }

  public get isEmpty() {
    return Object.keys(this._payload).length === 0;
  }

  public exists<F extends keyof TFilters>(field: F, value: TFilters[F] | TFilters[F][], op: TOperators = DEFAULT_OPERATOR as TOperators) {
    const values = Array.isArray(value) ? value : [value];
    const result = values.every((v) => !!this._payload?.[field]?.[op]?.includes(v));
    return result;
  }

  public clear(): Filterion<TFilters, TOperators> {
    if (this.isEmpty) { return this; }

    return new Filterion<TFilters, TOperators>();
  }

  public includes(filterion: Filterion<TFilters, TOperators>): boolean {
    if (this.isEmpty && filterion.isEmpty) { return true; }

    const currentPayload = this.payload;
    const externalPayload = filterion.payload;

    const currentKeys = Object.keys(currentPayload);
    const externalKeys = Object.keys(externalPayload);

    const existingExternalKeys = externalKeys.filter((ek) => currentKeys.includes(ek));
    const allExternalKeysExist = existingExternalKeys.length === currentKeys.length;
    if (!allExternalKeysExist) { return false; }

    for (const externalKey of existingExternalKeys) {
      const currentValue = currentPayload[externalKey];
      const externalValue = externalPayload[externalKey];

      const currentOperators = Object.keys(currentValue);
      const externalOperators = Object.keys(externalValue);

      const existingExternalOperators = externalOperators.filter((eop) => currentOperators.includes(eop));
      const allExternalOperatorsExist = existingExternalOperators.length === currentOperators.length;
      if (!allExternalOperatorsExist) { return false; }

      for (const externalOp of existingExternalOperators) {
        const currentItems = currentValue[externalOp];
        const externalItems = externalValue[externalOp];

        const allExternalItemsExist = externalItems.every((ei) => currentItems.includes(ei));
        if (!allExternalItemsExist) { return false; }
      }
    }

    return true;
  }

  public concat<F extends keyof TFilters, O extends TOperators>(filterion: Filterion<TFilters, TOperators>): Filterion<TFilters, TOperators> {
    if (filterion.isEmpty) { return this; }
    if (this.isEmpty) { return filterion; }
    if (this.includes(filterion)) { return this; }

    const payloadClone = Filterion.clonePayload(this._payload);
    const externalPayload = filterion.payload;
    const externalKeys = Object.keys(externalPayload) as F[];

    for (const field of externalKeys) {
      const externalOperators = Object.keys(externalPayload[field]) as O[];
      for (const op of externalOperators) {
        this.ensureFieldValueNotEmpty(payloadClone, field, op);
        const externalItems = externalPayload[field][op];
        for (const item of externalItems) {
          if (this.exists(field, item, op)) { continue; }
          payloadClone[field][op].push(item);
        }
      }
    }

    return new Filterion<TFilters, TOperators>(payloadClone);
  }

  private ensureFieldValueNotEmpty<F extends keyof TFilters>(payload: IFilterionPayload<TFilters, TOperators>, field: F, op: TOperators) {
    if (!payload[field]) {
      payload[field] = {};
    }
    if (!payload[field][op]) {
      payload[field][op] = [];
    }
  }

  private ensureFieldValueMeaningfull<F extends keyof TFilters>(payload: IFilterionPayload<TFilters, TOperators>, field: F, op: TOperators) {
    if (payload[field]) {
      if (payload[field][op]) {
        if (!payload[field][op].length) {
          delete payload[field][op];
        }
        if (!Object.keys(payload[field]).length) {
          delete payload[field];
        }
      }
    }
  }

  private static clonePayload<TFilters = any, TOperators extends string = string>(sourcePayload: IFilterionPayload<TFilters, TOperators>) {
    const clonedPayload = JSON.parse(JSON.stringify(sourcePayload)) as typeof sourcePayload;
    return clonedPayload;
  }
}

export type IFilterionPayload<TFilters = any, TOperators extends string = string> = {
  [f in keyof TFilters]?: {
    [o in TOperators]?: TFilters[f][];
  };
};

export type FilterionBaseOperators = '=';

const DEFAULT_OPERATOR: FilterionBaseOperators = '=';
