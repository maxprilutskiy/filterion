import { DEFAULT_OPERATOR } from './constants';
import { IFilterionPayload, MaybeArray } from './types';

/**
 * A data structure for filter criteria management
 *
 * @export
 * @class Filterion
 * @template S Filter interface
 * @template O Operators union type
 */
export class Filterion<S extends {} = {}, O extends string = string> {
  /**
   * Creates an instance of Filterion
   * @param {IFilterionPayload<S, O>} [_payload={}]
   * @memberof Filterion
   */
  public constructor(private _payload: IFilterionPayload<S, O> = {}) { }

  /**
   * Add new filter value
   *
   * @template K Type of the filter key
   * @param {K} field Filter key
   * @param {MaybeArray<S[K]>} value Filter value or array of such values
   * @param {*} [op=DEFAULT_OPERATOR as O] Operator
   * @returns {Filterion<S, O>} New Filterion instance
   * @memberof Filterion
   */
  public add<K extends keyof S>(field: K, value: MaybeArray<S[K]>, op = DEFAULT_OPERATOR as O): Filterion<S, O> {
    if (this.exists(field, value, op)) { return this; }

    const values = Array.isArray(value) ? value : [value];
    const payloadClone = Filterion.clonePayload(this.payload);

    this.ensureFieldValueNotEmpty(payloadClone, field, op);

    for (const v of values) {
      const valueExists = this.exists(field, v, op);
      if (valueExists) { continue; }

      payloadClone[field][op].push(v);
    }

    return new Filterion<S, O>(payloadClone);
  }

  /**
   * Remove filter value
   *
   * @template K Type of the filter key
   * @param {K} field Filter key
   * @param {MaybeArray<S[K]>} [value] Filter value or array of such values
   * @param {*} [op=DEFAULT_OPERATOR as O] Operator
   * @returns {Filterion<S, O>} New Filterion instance
   * @memberof Filterion
   */
  public remove<K extends keyof S>(field: K, value?: MaybeArray<S[K]>, op = DEFAULT_OPERATOR as O): Filterion<S, O> {
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
    return new Filterion<S, O>(payloadClone);
  }

  /**
   * Filterion payload
   *
   * @readonly
   * @type {IFilterionPayload<S, O>}
   * @memberof Filterion
   */
  public get payload(): IFilterionPayload<S, O> {
    return this._payload;
  }

  /**
   * Check whether current instance contains any filters values
   *
   * @readonly
   * @type {boolean}
   * @memberof Filterion
   */
  public get isEmpty(): boolean {
    return Object.keys(this._payload).length === 0;
  }

  /**
   * Check if value exists for a given filter
   *
   * @template K Type of the filter key
   * @param {K} field Filter key
   * @param {MaybeArray<S[K]>} value Filter value or array of such values
   * @param {*} [op=DEFAULT_OPERATOR as O] Operator
   * @returns {boolean} Check result
   * @memberof Filterion
   */
  public exists<K extends keyof S>(field: K, value: MaybeArray<S[K]>, op = DEFAULT_OPERATOR as O): boolean {
    const values = Array.isArray(value) ? value : [value];
    const result = values.every((v) => !!this._payload?.[field]?.[op]?.includes(v));
    return result;
  }

  /**
   * Produces empty Filterion instance
   *
   * @returns {Filterion<S, O>} Filterion instance
   * @memberof Filterion
   */
  public clear(): Filterion<S, O> {
    if (this.isEmpty) { return this; }

    return new Filterion<S, O>();
  }

  /**
   * Check if Filterion instance is a superset of another Filterion instance
   *
   * @param {Filterion<S, O>} filterion A Filterion instance to check against
   * @returns {boolean} Check result
   * @memberof Filterion
   */
  public includes(filterion: Filterion<S, O>): boolean {
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
   *
   * @template K Type of the filter key
   * @param {Filterion<S, O>} filterion Filterion instance
   * @returns {Filterion<S, O>} New Filterion instance
   * @memberof Filterion
   */
  public concat<K extends keyof S>(filterion: Filterion<S, O>): Filterion<S, O> {
    if (filterion.isEmpty) { return this; }
    if (this.isEmpty) { return filterion; }
    if (this.includes(filterion)) { return this; }

    const payloadClone = Filterion.clonePayload(this._payload);
    const externalPayload = filterion.payload;
    const externalKeys = Object.keys(externalPayload) as K[];

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

    return new Filterion<S, O>(payloadClone);
  }

  public attach(payload: IFilterionPayload<S, O>): this {
    this._payload = payload;
    return this;
  }

  /**
   * Initialize payload"s values collection if it doesn"t exist yet
   *
   * @private
   * @template K Type of the filter key
   * @param {IFilterionPayload<S, O>} payload Filterion payload
   * @param {K} field Filter key
   * @param {O} op Operator
   * @memberof Filterion
   */
  private ensureFieldValueNotEmpty<K extends keyof S>(payload: IFilterionPayload<S, O>, field: K, op: O): void {
    if (!payload[field]) {
      payload[field] = {};
    }
    if (!payload[field][op]) {
      payload[field][op] = [];
    }
  }

  /**
   * Remove values collection from a payload object if it"s empty
   *
   * @private
   * @template K
   * @param {IFilterionPayload<S, O>} payload
   * @param {K} field
   * @param {O} op
   * @memberof Filterion
   */
  private ensureFieldValueMeaningfull<K extends keyof S>(payload: IFilterionPayload<S, O>, field: K, op: O): void {
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

  /**
   * Create a copy of a Filterion payload
   *
   * @private
   * @static
   * @template S Filter interface
   * @template O Operators union type
   * @param {IFilterionPayload<S, O>} sourcePayload Source Filterion payload
   * @returns {IFilterionPayload<S, O>} Filterion payload copy
   * @memberof Filterion
   */
  private static clonePayload<S extends {}, O extends string>(sourcePayload: IFilterionPayload<S, O>): IFilterionPayload<S, O> {
    const clonedPayload = JSON.parse(JSON.stringify(sourcePayload)) as typeof sourcePayload;
    return clonedPayload;
  }
}
