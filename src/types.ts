export type IFilterionPayload<TFilters> = {
  [f in keyof TFilters]?: {
    [op: string]: TFilters[f][];
  };
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export type IFilterionConfig = {
  operators: string[];
  defaultOperator: string;
}

export type MaybeArray<T> = T | T[];
