<img width="120" src="https://github.com/prilutskiy/filterion/raw/master/assets/logo.svg?sanitize=true" align="right">

# Filterion
[![Build Status](https://travis-ci.com/prilutskiy/filterion.svg?branch=master)](https://travis-ci.com/prilutskiy/filterion)
[![codecov](https://codecov.io/gh/prilutskiy/filterion/branch/master/graph/badge.svg)](https://codecov.io/gh/prilutskiy/filterion)
[![CodeFactor](https://www.codefactor.io/repository/github/prilutskiy/filterion/badge)](https://www.codefactor.io/repository/github/prilutskiy/filterion)

<div>
An <a href="https://en.wikipedia.org/wiki/Immutable_object">immutable</a> data structure for filter criteria management.
</div>

## 📦 Install

Install `filterion` using npm:

```
npm i filterion
```

## 🔨 Usage

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

Or leverage the query string API:
```javascript
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

### Typescript

Filterion can be used in a type-safe context:

```typescript
import { Filterion } from 'filterion';

const filterion = new Filterion<{ name: string }>()
  .add('price', 649);

/*
error TS2345: Argument of type '"price"' is not assignable to parameter of type '"name"'.
*/

```

## 📖 API Reference

```
// TODO
```

Inspired by [immutable.js](https://github.com/immutable-js/immutable-js), an immutable collections library for JavaScript.

## License
MIT
