import { Filterion } from './Filterion';

describe('Filterion.add', () => {
  it('Adding a filter produces a new instance', () => {
    const filterion = new Filterion<MyTestFilter>();

    const modifiedFilterion = filterion.add('name', 'Max');

    expect(modifiedFilterion).not.toBe(filterion);
  });
  it('Adding an array of filter values produces a new instance', () => {
    const filterion = new Filterion<MyTestFilter>();

    const modifiedFilterion = filterion.add('name', ['Max', 'John']);

    expect(modifiedFilterion).not.toBe(filterion);
  });
  it('Adding a filter value', () => {
    const filterion = new Filterion<MyTestFilter>();
    const expectedPayload = { name: { '=': ['Max'] } };

    const filterionPayload = filterion
      .add('name', 'Max')
      .getPayload();

    expect(filterionPayload).toEqual(expectedPayload);
  });
  it('Adding an array of filter values', () => {
    const filterion = new Filterion<MyTestFilter>();
    const expectedPayload = { name: { '=': ['Max', 'John'] } };

    const filterionPayload = filterion
      .add('name', ['Max', 'John'])
      .getPayload();

    expect(filterionPayload).toEqual(expectedPayload);
  });
  it('Adding a filter uses = operator by default', () => {
    const filterion = new Filterion<MyTestFilter>();
    const expectedPayload = { name: { '=': ['Max'] } };

    const filterionPayload = filterion
      .add('name', 'Max')
      .getPayload();

    expect(filterionPayload).toStrictEqual(expectedPayload);
  });
  it('Adding a filter twice should be a noop', () => {
    const filterion = new Filterion<MyTestFilter>();
    const expectedPayload = { name: { '=': ['Max'] } };

    const filterionPayload = filterion
      .add('name', 'Max')
      .add('name', 'Max')
      .getPayload();

    expect(filterionPayload).toStrictEqual(expectedPayload);
  });
  it('Adding a filter twice should not produce another instance', () => {
    const filterion = new Filterion<MyTestFilter>()
      .add('name', 'Max');
    const expectedPayload = filterion.getPayload();

    const filterionPayload = filterion
      .add('name', 'Max')
      .getPayload();

    expect(filterionPayload).toBe(expectedPayload);
  });
});

describe('Filterion.exists', () => {
  it('Value should exist after it was added', () => {
    const filterion = new Filterion<MyTestFilter>()
      .add('name', 'Max');

    const exists = filterion.exists('name', 'Max');

    expect(exists).toBeTruthy();
  });
  it('Value should exist after it was added within an array', () => {
    const filterion = new Filterion<MyTestFilter>()
      .add('name', ['Max', 'John']);

    const exists = filterion.exists('name', 'Max');

    expect(exists).toBeTruthy();
  });
  it('Value should not exist before it was added', () => {
    const filterion = new Filterion<MyTestFilter>();

    const exists = filterion.exists('name', 'Max');

    expect(exists).toBeFalsy();
  });
  it('Value array should exist after it was added', () => {
    const filterion = new Filterion<MyTestFilter>()
      .add('name', ['Max', 'John']);

    const exists = filterion.exists('name', ['Max', 'John']);

    expect(exists).toBeTruthy();
  });
  it('Value array should exist after its elements were added one by one', () => {
    const filterion = new Filterion<MyTestFilter>()
      .add('name', 'Max')
      .add('name', 'John');

    const exists = filterion.exists('name', ['Max', 'John']);

    expect(exists).toBeTruthy();
  });
  it('Value array shouldnt exist if some elements are missing', () => {
    const filterion = new Filterion<MyTestFilter>()
      .add('name', ['Max', 'John']);

    const exists = filterion.exists('name', ['Max', 'John', 'Jane']);

    expect(exists).toBeFalsy();
  });
  it('Value array should exist partially', () => {
    const filterion = new Filterion<MyTestFilter>()
      .add('name', ['Max', 'John', 'Jane']);

    const exists = filterion.exists('name', ['Max', 'John']);

    expect(exists).toBeTruthy();
  });
});

describe('Filterion.remove', () => {
  const filterion = new Filterion<MyTestFilter>()
    .add('name', 'Max');

  it('Remove unexisting element should be a noop', () => {
    const expectedPayload = { name: { '=': ['Max'] } };

    const filterionPayload = filterion
      .remove('name', 'John')
      .getPayload();

    expect(filterionPayload).toEqual(expectedPayload);
  });
  it('Remove unexisting element should not product new instance', () => {
    const newFilterion = filterion
      .remove('name', 'John');

    expect(newFilterion).toBe(filterion);
  });
  it('Remove existing element', () => {
    const expectedPayload = {};
    const newFilterionPayload = filterion
      .remove('name', 'Max')
      .getPayload();

    expect(newFilterionPayload).toStrictEqual(expectedPayload);
  });
  it('Remove existing elements array', () => {
    const expectedPayload = {};
    const newFilterionPayload = filterion
      .add('name', 'John')
      .remove('name', ['Max', 'John'])
      .getPayload();

    expect(newFilterionPayload).toStrictEqual(expectedPayload);
  });
  it('Remove existing element with different operator should result in noop', () => {
    const expectedPayload = filterion.getPayload();
    const newFilterionPayload = new Filterion<MyTestFilter, '=' | '^'>()
      .attach(filterion.getPayload())
      .remove('name', 'Max', '^')
      .getPayload();

    expect(newFilterionPayload).toBe(expectedPayload);
  });
});

describe('Filterion.includes', () => {
  const filterion = new Filterion<MyTestFilter>()
    .add('name', ['Max', 'John']);

  it('Includes should return true when matching subfilterion is passed', () => {
    const subfilterion = new Filterion<MyTestFilter>()
      .add('name', ['Max']);

    const doesInclude = filterion.includes(subfilterion);

    expect(doesInclude).toBeTruthy();
  });

  it('Includes should return false when unmatchingsubfilterion is passed', () => {
    const subfilterion = new Filterion<MyTestFilter>()
      .add('age', [10, 20]);

    const doesInclude = filterion.includes(subfilterion);

    expect(doesInclude).toBeFalsy();
  });
});

describe('Filterion.concat', () => {
  it('Concat should merge to filterions', () => {
    const filterion1 = new Filterion<MyTestFilter>()
      .add('name', 'Max');
    const filterion2 = new Filterion<MyTestFilter>()
      .add('name', 'John');
    const expectedPayload = { name: { '=': ['Max', 'John'] } };

    const finalPayload = filterion1
      .concat(filterion2)
      .getPayload();

    expect(finalPayload).toStrictEqual(expectedPayload);
  });
  it('Duplicate values should be ommited during when concatenated', () => {
    const filterion1 = new Filterion<MyTestFilter>()
      .add('name', 'Max')
      .add('name', 'John');
    const filterion2 = new Filterion<MyTestFilter>()
      .add('name', 'John');
    const expectedPayload = { name: { '=': ['Max', 'John'] } };

    const finalPayload = filterion1
      .concat(filterion2)
      .getPayload();

    expect(finalPayload).toStrictEqual(expectedPayload);
  });
});

describe('Filterion.clear', () => {
  it('Clear should produce empty filterion', () => {
    const filterion = new Filterion<MyTestFilter>()
      .add('name', 'Max');
    const expectedPayload = {};

    const filterionPayload = filterion
      .clear()
      .getPayload();

    expect(filterionPayload).toStrictEqual(expectedPayload);
  });
  it('Clearing empty filterion should not produce new isntance', () => {
    const filterion = new Filterion<MyTestFilter>();

    const clearedFilterion = filterion.clear();

    expect(clearedFilterion).toBe(filterion);
  });
});

describe('Filterion.attach', () => {
  it('Attached payload is accessible', () => {
    const payload = { name: { '=': ['Max'] } };
    const expectedPayload = payload;

    const actualPayload = new Filterion<MyTestFilter>()
      .attach(payload)
      .getPayload();

    expect(actualPayload).toStrictEqual(expectedPayload);
  });
  it('Attach produces a new instance', () => {
    const payload = { name: { '=': ['Max'] } };
    const initialFilterion = new Filterion<MyTestFilter>();

    const filterion = initialFilterion
      .attach(payload);

    expect(filterion).not.toBe(initialFilterion);
  });
  it('Attached payload overrides existing payload', () => {
    const filterion = new Filterion<MyTestFilter>()
      .add('age', 0);
    const payload = { name: { '=': ['Max'] } };
    const expectedPayload = {
      name: { '=': ['Max'] },
    };

    const actualPayload = filterion
      .attach(payload)
      .getPayload();

    expect(actualPayload).toStrictEqual(expectedPayload);
  });
});

type MyTestFilter = {
  name: string;
  age: number;
  isActive: boolean;
  createdAt: string;
};
