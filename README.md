<p align="center">
  <img width="200" src="https://cdn1.iconfinder.com/data/icons/jumpicon-basic-ui-filled-line-1/32/-_Filter-Filters-512.png">
</p>

<h1 align="center">Filterion</h1>

<div align="center">
A zero-dependencies immutable data structure for filter criteria management.

[![Package Version](https://img.shields.io/npm/v/filterion)](https://npmjs.com/package/filterion)
[![Build Status](https://img.shields.io/travis/com/prilutskiy/filterion/master)](https://travis-ci.com/prilutskiy/filterion)

</div>

Example:

```typescript
const filter = new Filterion()
  .add("name", "Max")
  .add("city", "Minsk")
  .add("date", "yesterday", ">")
  .add("date", "tomorrow", "<");

console.log(filter.payload);

/*
{
  name: { '=': [ 'Max' ] },
  city: { '=': [ 'Minsk' ] },
  date: { '>': [ 'yesterday' ], '<': [ 'tomorrow' ] }
}
*/
```
