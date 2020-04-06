import { IFilterionConfig } from './types';

export const DEFAULT_OPERATOR = '=';

export const DEFAULT_CONFIG: IFilterionConfig = {
  defaultOperator: DEFAULT_OPERATOR,
  operators: [DEFAULT_OPERATOR],
};

