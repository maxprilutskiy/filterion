import { Filterion } from './Filterion';
import { DEFAULT_CONFIG } from './constants';

describe('Filterion.configure', () => {
  afterEach(() => {
    Filterion.configure(DEFAULT_CONFIG);
  });
  it('Global config is used by default', () => {
    Filterion.configure({ operators: ['=', '!='] });
    const expectedConfig = Filterion.getConfig();

    const config = new Filterion().getConfig();

    expect(config).toStrictEqual(expectedConfig);
  });
});

describe('new Filterion', () => {
  it('Global config falls back to the default config', () => {
    const expectedConfig = DEFAULT_CONFIG;

    const config = Filterion.getConfig();

    expect(config).toStrictEqual(expectedConfig);
  });
  it('Falls back to the global config', () => {
    const expectedConfig = Filterion.getConfig();

    const config = new Filterion<MyTestFilter>()
      .getConfig();

    expect(config).toStrictEqual(expectedConfig);
  });
  it('Provided config should be merged with the global config', () => {
    const globalConfig = Filterion.getConfig();
    const expectedConfig = {
      ...globalConfig,
      operators: ['=', '!='],
    };

    const config = new Filterion<MyTestFilter>({ operators: ['=', '!='] })
      .getConfig();

    expect(config).toStrictEqual(expectedConfig);
  });
  it('Cannot have empty defaultOperator', () => {
    const ctor = (): Filterion =>
      new Filterion<MyTestFilter>({ defaultOperator: '' });

    expect(ctor).toThrow();
  });
  it('Cannot have no operators', () => {
    const ctor = (): Filterion =>
      new Filterion<MyTestFilter>({ operators: null });

    expect(ctor).toThrow();
  });
  it('Cannot have empty operators', () => {
    const ctor = (): Filterion =>
      new Filterion<MyTestFilter>({ operators: [] });

    expect(ctor).toThrow();
  });
  it('Operators must contain the default operator', () => {
    const ctor = (): Filterion =>
      new Filterion<MyTestFilter>({ operators: ['<'] });

    expect(ctor).toThrow();
  });
  it('Invalid operators are forbidden', () => {
    const ctor = (): Filterion =>
      new Filterion<MyTestFilter>({ operators: ['=', 'hi'] });

    expect(ctor).toThrow();
  });
  it('Ampersand operator is forbidden', () => {
    const ctor = (): Filterion =>
      new Filterion<MyTestFilter>({ operators: ['=', '&'] });

    expect(ctor).toThrow();
  });
});

describe('filterion.add', () => {
  it('Adding a filter produces a new instance', () => {
    const filterion = new Filterion<MyTestFilter>();

    const modifiedFilterion = filterion.add('name', 'Max');

    expect(modifiedFilterion).not.toBe(filterion);
  });
  it('New instance is constructed with the same config', () => {
    const filterion = new Filterion<MyTestFilter>();
    const expectedConfig = filterion.getConfig();

    const config = filterion.add('name', 'Max').getConfig();

    expect(config).toStrictEqual(expectedConfig);
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
  it('Adding a filter with an unknown operator results in an error', () => {
    const ctor = (): Filterion =>
      new Filterion<MyTestFilter>().add('name', 'Max', '!=');

    expect(ctor).toThrow();
  })
});

describe('filterion.exists', () => {
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
  it('A filter existance check performed with an unknown operator results in an error', () => {
    const ctor = (): boolean =>
      new Filterion<MyTestFilter>().exists('name', 'Max', '!=');

    expect(ctor).toThrow();
  });
});

describe('filterion.remove', () => {
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
  it('New instance is constructed with the same config', () => {
    const expectedConfig = filterion.getConfig();

    const newConfig = filterion
      .remove('name', 'John')
      .getConfig();

    expect(newConfig).toStrictEqual(expectedConfig);
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
    const newFilterionPayload = new Filterion<MyTestFilter>({ operators: ['=', '^'] })
      .attach(filterion.getPayload())
      .remove('name', 'Max', '^')
      .getPayload();

    expect(newFilterionPayload).toBe(expectedPayload);
  });
  it('Removing a filter without a value should remove the filter entirely', () => {
    const expectedPayload = { isActive: { '=': [true] } };
    const filterion = new Filterion<MyTestFilter>()
      .add('name', 'Max')
      .add('name', 'John')
      .add('isActive', true);

    const payload = filterion
      .remove('name')
      .getPayload();

    expect(payload).toStrictEqual(expectedPayload);
  });
  it('Removing a filter with undefined value should not remove the filter entirely', () => {
    const filterion = new Filterion<MyTestFilter>()
      .add('name', 'Max')
      .add('name', 'John')
      .add('isActive', true);
    const expectedPayload = filterion.getPayload();

    const payload = filterion
      .remove('name', undefined)
      .getPayload();

    expect(payload).toStrictEqual(expectedPayload);
  });
  it('Removing a filter with an unknown operator results in an error', () => {
    const ctor = (): Filterion =>
      new Filterion<MyTestFilter>().remove('name', 'Max', '!=');

    expect(ctor).toThrow();
  })
});

describe('filterion.includes', () => {
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

describe('filterion.concat', () => {
  it('Concat produces a new instance', () => {
    const filterion1 = new Filterion<MyTestFilter>()
      .add('name', 'Max');
    const filterion2 = new Filterion<MyTestFilter>()
      .add('name', 'John');

    const finalPayload = filterion1
      .concat(filterion2);

    expect(finalPayload).not.toBe(filterion1);
    expect(finalPayload).not.toBe(filterion2);
  });
  it('New instance is constructed with the same config as the target instance', () => {
    const filterion1 = new Filterion<MyTestFilter>()
      .add('name', 'Max');
    const filterion1Config = filterion1.getConfig();
    const filterion2 = new Filterion<MyTestFilter>({ defaultOperator: '=', operators: ['=', '!='] })
      .add('name', 'John');
    const filterion2Config = filterion2.getConfig();

    const finalConfig = filterion1
      .concat(filterion2)
      .getConfig();

    expect(finalConfig).toStrictEqual(filterion1Config);
    expect(finalConfig).not.toStrictEqual(filterion2Config);
  });
  it('Concat should merge two filterions', () => {
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

describe('filterion.clear', () => {
  it('Clear should produce empty filterion', () => {
    const filterion = new Filterion<MyTestFilter>()
      .add('name', 'Max');
    const expectedPayload = {};

    const filterionPayload = filterion
      .clear()
      .getPayload();

    expect(filterionPayload).toStrictEqual(expectedPayload);
  });
  it('New instance is constructed with the same config', () => {
    const filterion = new Filterion<MyTestFilter>()
      .add('name', 'Max');
    const expectedConfig = filterion.getConfig();

    const filterionConfig = filterion
      .clear()
      .getConfig();

    expect(filterionConfig).toStrictEqual(expectedConfig);
  });
  it('Clearing empty filterion should not produce new isntance', () => {
    const filterion = new Filterion<MyTestFilter>();

    const clearedFilterion = filterion.clear();

    expect(clearedFilterion).toBe(filterion);
  });
});

describe('filterion.attach', () => {
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
  it('New instance is constructed with the same config', () => {
    const payload = { name: { '=': ['Max'] } };
    const initialFilterion = new Filterion<MyTestFilter>();
    const expectedConfig = initialFilterion.getConfig();

    const filterionConfig = initialFilterion
      .attach(payload)
      .getConfig();

    expect(filterionConfig).toStrictEqual(expectedConfig);
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

describe('filterion.isEmpty', () => {
  it('Newly created instance is empty', () => {
    const isEmpty = new Filterion<MyTestFilter>()
      .isEmpty;

    expect(isEmpty).toBe(true);
  });
  it('Instance with data is not empty', () => {
    const isEmpty = new Filterion<MyTestFilter>()
      .add('name', 'Max')
      .isEmpty;

    expect(isEmpty).toBe(false);
  });
});

describe('filterion.getPayload', () => {
  it('Newly created instance has empty payload', () => {
    const expectedPayload = {};

    const payload = new Filterion<MyTestFilter>()
      .getPayload();

    expect(payload).toStrictEqual(expectedPayload);
  });
  it('Payload has valid format', () => {
    const expectedPayload = {
      name: { '=': ['Max'] },
      age: { '>': [0], '<': [100] },
    };

    const payload = new Filterion<MyTestFilter>({ operators: ['=', '<', '>'] })
      .add('name', 'Max')
      .add('age', 0, '>')
      .add('age', 100, '<')
      .getPayload();

    expect(payload).toStrictEqual(expectedPayload);
  });
});

describe('filterion.getPartialPayload', () => {
  it('Partial payload is an empty object when no data', () => {
    const payload = new Filterion<MyTestFilter>()
      .getPartialPayload('name');

    expect(payload).toStrictEqual({});
  });
  it('Partial payload has valid format', () => {
    const expectedPartialPayload = { '>': [0], '<': [100] }

    const payload = new Filterion<MyTestFilter>({ operators: ['=', '<', '>'] })
      .add('name', 'Max')
      .add('age', 0, '>')
      .add('age', 100, '<')
      .getPartialPayload('age');

    expect(payload).toStrictEqual(expectedPartialPayload);
  });
});

describe('filterion.getValues', () => {
  beforeAll(() => Filterion.configure({ operators: ['=', '<', '>'] }));
  afterAll(() => Filterion.configure(DEFAULT_CONFIG));

  it('Values is empty array when no data', () => {
    const values = new Filterion<MyTestFilter>()
      .getValues('name');

    expect(values).toStrictEqual([]);
  });
  it('Values has valid format', () => {
    const expectedValues = [100];

    const values = new Filterion<MyTestFilter>()
      .add('age', 100, '<')
      .getValues('age', '<');

    expect(values).toStrictEqual(expectedValues);
  });
  it('Fallbacks to the default operator when no op is specified', () => {
    const expectedValues = ['Max'];

    const values = new Filterion<MyTestFilter>()
      .add('name', 'Max', '=')
      .add('age', 100, '<')
      .getValues('name');

    expect(values).toStrictEqual(expectedValues);
  });
  it('A filter values getter invoked with an unknown operator results in an error', () => {
    const ctor = (): string[] =>
      new Filterion<MyTestFilter>().getValues('name', '!=');

    expect(ctor).toThrow();
  });
});

describe('filterion.toJSON', () => {
  it('stringified representation matches the payload repesentation', () => {
    const filterion = new Filterion<MyTestFilter>()
      .add('name', 'Max');
    const payload = filterion.getPayload();

    const json = JSON.stringify(filterion);
    const payloadJson = JSON.stringify(payload);

    expect(json).toStrictEqual(payloadJson);
  });
  it('toJSON result matches the payload', () => {
    const filterion = new Filterion<MyTestFilter>()
      .add('name', 'Max');
    const payload = filterion.getPayload();

    const toJsonResult = filterion.toJSON();

    expect(toJsonResult).toStrictEqual(payload);
  })
});

describe('filterion.toQueryString', () => {
  beforeAll(() => Filterion.configure({ operators: ['=', '<', '>'] }));
  afterAll(() => Filterion.configure(DEFAULT_CONFIG));

  it('emits a valid query string', () => {
    const filterion = new Filterion<MyTestFilter>()
      .add('name', 'Max')
      .add('name', '±!@#$%^&*()\'_+ ";//\\,.')
      .add('is active', true)
      .add('age', 0, '>')
      .add('age', 100, '<');
    const expectedQueryString =
      'name=Max&name=%C2%B1!%40%23%24%25%5E%26*()\'_%2B%20%22%3B%2F%2F%5C%2C.&is%20active=true&age>0&age<100';

    const queryString = filterion.toQueryString();

    expect(queryString).toBe(expectedQueryString);
  });
});

describe('Filterion.fromQueryString', () => {
  beforeAll(() => Filterion.configure({ operators: ['=', '<', '>'] }));
  afterAll(() => Filterion.configure(DEFAULT_CONFIG));

  it('Query string parsing produces valid filterion', () => {
    const queryString = 'http://localhost:3000?name=Max&name=%C2%B1!%40%23%24%25%5E%26*()\'_%2B%20%22%3B%2F%2F%5C%2C.&is%20active=true&age>0&age<100';
    const expectedPayload = new Filterion<MyTestFilter>()
      .add('name', 'Max')
      .add('name', '±!@#$%^&*()\'_+ ";//\\,.')
      .add('is active', true)
      .add('age', 0, '>')
      .add('age', 100, '<')
      .getPayload();

    const payload = new Filterion<MyTestFilter>()
      .fromQueryString(queryString)
      .getPayload();

    expect(payload).toStrictEqual(expectedPayload);
  })
});

type MyTestFilter = {
  name: string;
  age: number;
  isActive: boolean;
  'is active': boolean;
  createdAt: string;
};
