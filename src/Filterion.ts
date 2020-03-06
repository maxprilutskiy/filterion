export class Filterion<TFilters = any, TOperators extends FilterionBaseOperators = FilterionBaseOperators> {
  public constructor(
    private _payload: IFilterionPayload<TFilters, TOperators> = {},
  ) { }

  public add<F extends keyof TFilters>(field: F, values: TFilters[F] | TFilters[F][], op?: TOperators): Filterion<TFilters, TOperators>;
  public add<F extends keyof TFilters>(field: F, value: TFilters[F] | TFilters[F][], operator?: TOperators): Filterion<TFilters, TOperators> {
    let payloadClone = Filterion.clonePayload(this.payload);
    const op = operator || DEFAULT_OPERATOR;

    const currentField = payloadClone[field] || {};
    const currentFieldValue = currentField[op] || [];

    if (currentFieldValue.includes(value)) { return this; }

    payloadClone = {
      ...payloadClone,
      [field]: {
        ...currentField,
        [op]: [
          ...currentFieldValue,
          value,
        ],
      },
    };

    return new Filterion<TFilters, TOperators>(payloadClone);
  }

  public remove<F extends keyof TFilters>(field: F, value?: TFilters[F] | TFilters[F][]): Filterion<TFilters, TOperators>;
  public remove<F extends keyof TFilters>(_field: F, _value?: TFilters[F] | TFilters[F][]): this {
    return this;
  }

  public get payload() {
    return this._payload;
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
