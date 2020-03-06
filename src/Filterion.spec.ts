import { Filterion } from './Filterion';

describe('Filterion.add', () => {
  it('Adding a filter produces a new instance', () => {
    const filterion = new Filterion<MyTestFilter>();

    const modifiedFilterion = filterion.add('name', 'Max');

    expect(modifiedFilterion).not.toBe(filterion);
  });
  it('Adding a filter uses = operator by default', () => {
    const filterion = new Filterion<MyTestFilter>();
    const expectedPayload: typeof filterion.payload = { name: { '=': ['Max'] } };

    const filterionPayload = filterion
      .add('name', 'Max')
      .payload;

    expect(filterionPayload).toEqual(expectedPayload);
  });
  it('Adding a filter twice should be a noop', () => {
    const filterion = new Filterion<MyTestFilter>();
    const expectedPayload: typeof filterion.payload = { name: { '=': ['Max'] } };

    const filterionPayload = filterion
      .add('name', 'Max')
      .add('name', 'Max')
      .payload;

    expect(filterionPayload).toEqual(expectedPayload);
  });
  it('Adding a filter twice should not produce another instance', () => {
    const filterion = new Filterion<MyTestFilter>()
      .add('name', 'Max');
    const expectedPayload = filterion.payload;

    const filterionPayload = filterion
      .add('name', 'Max')
      .payload;

    expect(filterionPayload).toBe(expectedPayload);
  });
});

type MyTestFilter = {
  name: string;
  age: number;
  isActive: boolean;
  createdAt: string;
};
