export type IFilterionPayload<TFilters extends {}, TOperators extends string> = {
  [f in keyof TFilters]?: {
    [o in TOperators]?: TFilters[f][];
  };
};

export type MaybeArray<T> = T | T[];
