export type IFilterionPayload<TFilters extends {}, TOperators extends string> = {
  [f in keyof TFilters]?: IFilterionPartialPayload<f, TFilters, TOperators>;
};

export type IFilterionPartialPayload<f extends keyof TFilters, TFilters extends {}, TOperators extends string> = {
  [o in TOperators]?: TFilters[f][];
};

export type MaybeArray<T> = T | T[];
