export type IFilterionPayload<TFilters extends {}> = {
  [f in keyof TFilters]?: {
    [op: string]: TFilters[f][];
  };
};

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
export type IFilterionConfig<TFilters extends {} = {}> = {
  operators: string[];
  defaultOperator: string;
}

export type MaybeArray<T> = T | T[];
