import { DEFAULT_CONFIG } from './constants';
import { IFilterionPayload, MaybeArray, IFilterionConfig } from './types';
import { parseExpression } from './utils';

/**
 * A data structure for filter criteria management
 *
 */
export class Filterion<S extends {} = any> {
  private static config: IFilterionConfig = DEFAULT_CONFIG;

  private payload: IFilterionPayload<S> = {};
  private config: IFilterionConfig<S> = Filterion.config;

  /**
   * Set global configuration
   */
  public static configure(config?: Partial<IFilterionConfig>): void {
    Filterion.initConfig(
      config,
      (c) => Filterion.config = c,
    );
  }

  /**
   * Get global configuration
   */
  public static getConfig(): IFilterionConfig {
    return Filterion.config;
  }

  /**
   * Create Filterion from a query string
   */
  public fromQueryString<S extends {} = {}>(queryString: string): Filterion<S> {
    let startIndex = queryString.indexOf('?');
    if (startIndex === -1) { startIndex = 0; }
    startIndex += 1;

    const result = queryString
      .substr(startIndex)
      .split('&')
      .map(parseExpression(this.config.operators))
      .reduce<Filterion<S>>((f, [field, op, value]) => f.add(field as any, value, op), new Filterion());

    return result;
  }

  /**
   * Creates an instance of Filterion
   */
  public constructor(config?: Partial<IFilterionConfig<S>>) {
    Filterion.initConfig(
      config,
      (c) => this.config = c,
    );
  }

  /**
   * Add new filter value
   */
  public add<K extends keyof S>(field: K, value: MaybeArray<S[K]>, op = this.config.defaultOperator): Filterion<S> {
    this.validateOperator(op);

    if (this.exists(field, value, op)) { return this; }

    const values = Array.isArray(value) ? value : [value];
    const payloadClone = Filterion.clonePayload(this.payload);

    this.ensureFieldValueNotEmpty(payloadClone, field, op);

    for (const v of values) {
      const valueExists = this.exists(field, v, op);
      if (valueExists) { continue; }

      payloadClone[field][op].push(v);
    }

    return new Filterion<S>(this.config).attach(payloadClone);
  }

  /**
   * Remove filter value
   */
  public remove<K extends keyof S>(field: K, value?: MaybeArray<S[K]>, op = this.config.defaultOperator): Filterion<S> {
    this.validateOperator(op);

    if (!this.exists(field, value, op)) { return this; }

    const payloadClone = Filterion.clonePayload(this.payload);
    if (!value) {
      delete payloadClone[field];
      return new Filterion<S>(this.config).attach(payloadClone);
    }
    const values = Array.isArray(value) ? value : [value];

    this.ensureFieldValueNotEmpty(payloadClone, field, op);

    for (const v of values) {
      const valueExists = this.exists(field, v, op);
      if (!valueExists) { continue; }

      const vIndex = payloadClone[field][op].indexOf(v);
      payloadClone[field][op].splice(vIndex, 1);
    }

    this.ensureFieldValueMeaningfull(payloadClone, field, op);
    return new Filterion<S>(this.config).attach(payloadClone);
  }

  /**
   * Get Filterion payload
   */
  public getPayload(): IFilterionPayload<S> {
    return this.payload;
  }

  /**
   * Get Filterion partial payload
   */
  public getPartialPayload<K extends keyof S>(field: K): IFilterionPayload<S>[K] {
    const result = this.payload[field] || {};
    return result;
  }

  /**
   * Get Filterion filter values
   */
  public getValues<K extends keyof S>(field: K, op = this.config.defaultOperator): S[K][] {
    this.validateOperator(op);

    const getPartialPayload = this.getPartialPayload(field);
    const result = getPartialPayload[op] || [];
    return result;
  }

  /**
   * Check whether current instance contains any filters values
   */
  public get isEmpty(): boolean {
    return Object.keys(this.payload).length === 0;
  }

  public getConfig(): IFilterionConfig<S> {
    return this.config;
  }

  /**
   * Check if value exists for a given filter
   */
  public exists<K extends keyof S>(field: K, value: MaybeArray<S[K]>, op = this.config.defaultOperator): boolean {
    this.validateOperator(op);

    const values = Array.isArray(value) ? value : [value];
    const result = values.every((v) => !!this.payload?.[field]?.[op]?.includes(v));
    return result;
  }

  /**
   * Produces empty Filterion instance
   */
  public clear(): Filterion<S> {
    if (this.isEmpty) { return this; }

    return new Filterion<S>(this.config);
  }

  /**
   * Check if Filterion instance is a superset of another Filterion instance
   */
  public includes(filterion: Filterion<S>): boolean {
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

      const currenO = Object.keys(currentValue);
      const externalOperators = Object.keys(externalValue);

      const existingExternalOperators = externalOperators.filter((eop) => currenO.includes(eop));
      const allExternalOperatorsExist = existingExternalOperators.length === currenO.length;
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

  /**
   * Merge with another Filterion instance
   */
  public concat<K extends keyof S>(filterion: Filterion<S>): Filterion<S> {
    if (filterion.isEmpty) { return this; }
    if (this.isEmpty) { return filterion; }
    if (this.includes(filterion)) { return this; }

    const payloadClone = Filterion.clonePayload(this.payload);
    const externalPayload = filterion.payload;
    const externalKeys = Object.keys(externalPayload) as K[];

    for (const field of externalKeys) {
      const externalOperators = Object.keys(externalPayload[field]);
      for (const op of externalOperators) {
        this.ensureFieldValueNotEmpty(payloadClone, field, op);
        const externalItems = externalPayload[field][op];
        for (const item of externalItems) {
          if (this.exists(field, item, op)) { continue; }
          payloadClone[field][op].push(item);
        }
      }
    }

    return new Filterion<S>(this.config).attach(payloadClone);
  }

  /*
   * Attach existing payload
   */
  public attach(payload: IFilterionPayload<S>): Filterion<S> {
    const result = new Filterion<S>(this.config);
    result.payload = payload;
    return result;
  }

  /*
   * Get JSON representation of the instance
   */
  public toJSON(): IFilterionPayload<S> {
    return this.payload;
  }

  /*
   * Get QueryString representation of the instance
   */
  public toQueryString(): string {
    const chunks = [];
    const fields = Object.keys(this.payload);
    for (const field of fields) {
      const operators = Object.keys(this.payload[field]);
      for (const op of operators) {
        const values = this.payload[field][op];
        for (const value of values) {
          const encodedField = encodeURIComponent(field);
          const encodedValue = encodeURIComponent(value);
          const chunk = `${encodedField}${op}${encodedValue}`;
          chunks.push(chunk);
        }
      }
    }

    const result = chunks.join('&');
    return result;
  }

  /**
   * Initialize payload"s values collection if it doesn"t exist yet
   */
  private ensureFieldValueNotEmpty<K extends keyof S>(payload: IFilterionPayload<S>, field: K, op: string): void {
    if (!payload[field]) {
      payload[field] = {};
    }
    if (!payload[field][op]) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      payload[field][op] = [];
    }
  }

  /**
   * Remove values collection from a payload object if it"s empty
   */
  private ensureFieldValueMeaningfull<K extends keyof S>(payload: IFilterionPayload<S>, field: K, op: string): void {
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

  private validateOperator(op: string): void {
    if (!this.config.operators.includes(op)) {
      throw new Error(`${op} is an invalid operator. It is missing from the operators configuration.`)
    }
  }

  /**
   * Create a copy of a Filterion payload
   */
  private static clonePayload<S extends {}>(sourcePayload: IFilterionPayload<S>): IFilterionPayload<S> {
    const clonedPayload = JSON.parse(JSON.stringify(sourcePayload)) as typeof sourcePayload;
    return clonedPayload;
  }

  /**
   * Initialize configuration using provided setter
   */
  private static initConfig(config: Partial<IFilterionConfig>, setConfig: (c: IFilterionConfig) => void): void {
    if (!config) { return; }
    const newConfig = {
      ...Filterion.config,
      ...config,
    };
    Filterion.validateConfig(newConfig);
    setConfig(newConfig);
  }

  /**
   * Validate configuration object
   */
  private static validateConfig(config: IFilterionConfig): void {
    if (!config.defaultOperator) {
      throw new Error('Default operator not found');
    }
    if (!config.operators?.length) {
      throw new Error('No operators found');
    }
    if (!config.operators?.includes(config.defaultOperator)) {
      throw new Error('Default operator must be included in operators list');
    }
    if (config.operators?.some((op) => op.includes('&'))) {
      throw new Error('Ampersand operator is forbidden');
    }
    for (const op of config.operators) {
      const encodedOp = encodeURIComponent(op);
      if (op !== encodedOp) { continue; }
      throw new Error(`${op} is an invalid operator. Operator's encoded value must be different from its original value`)
    }
  }
}
