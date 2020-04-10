<p align="center">
  <img width="200" src="/assets/logo.svg?sanitize=true">
</p>

<h1 align="center">
Filterion

<div align="center">

</div>
</h1>

<div align="center">

</div>

An [immutable](https://en.wikipedia.org/wiki/Immutable_object) data structure for filter criteria management.

[![Build Status](https://travis-ci.com/prilutskiy/filterion.svg?branch=master)](https://travis-ci.com/prilutskiy/filterion)
[![codecov](https://codecov.io/gh/prilutskiy/filterion/branch/master/graph/badge.svg)](https://codecov.io/gh/prilutskiy/filterion)
[![CodeFactor](https://www.codefactor.io/repository/github/prilutskiy/filterion/badge)](https://www.codefactor.io/repository/github/prilutskiy/filterion)

**Filterion** data cannot be changed once created, leading to much simpler application development, no defensive copying, enabling advanced memoization and change detection techniques with simple logic. Persistent data structure presents a mutative API which does not update the data in-place, but instead always yields new updated data.

**Filterion** has a built-in API to work with query strings, allowing zero-effort url manipulations.

## Install

Install `filterion` using yarn or npm:

```bash
$ yarn add filterion
# or
$ npm i filterion
```

## Usage

Require it into any module and use natively:

```javascript
import { Filterion } from 'filterion';

const filter = new Filterion()
  .add('device', 'iPhone')
  .add('price', 649);

console.log(filter.getPayload());

/*
{
  device: { '=': [ 'iPhone' ] },
  price: { '=': [ 649 ] }
}
*/
```

Or leverage the query string api:
```typescript
import { Filterion } from 'filterion';

const newQuery = new Filterion()
  .fromQueryString('device=iPhone&price=649')
  .remove('price')
  .add('year', 2007)
  .toQueryString();

console.log(newQuery);

/*
device=iPhone&year=2007
*/

```

## API

```
// TODO
```

## Kudos
Inspired by [immutable.js](https://github.com/immutable-js/immutable-js), an immutable collections library for JavaScript.

## License
MIT
