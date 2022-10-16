<p align="center"><img width="200" src="/assets/logo.svg?sanitize=true"></p>
<h1 align="center">Filterion</h1>
<div align="center">
An <a href="https://en.wikipedia.org/wiki/Immutable_object">immutable</a> data structure for search params management.
</div>
<h3 align="center">

[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![codecov](https://codecov.io/gh/maxprilutskiy/filterion/branch/main/graph/badge.svg?token=XNVEAODW13)](https://codecov.io/gh/maxprilutskiy/filterion)
[![Release](https://github.com/maxprilutskiy/filterion/actions/workflows/release.yml/badge.svg)](https://github.com/maxprilutskiy/filterion/actions/workflows/release.yml)

</h3>

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

#### Typescript

Filterion can be used in a type-safe context:

```typescript
import { Filterion } from 'filterion';

// Good
const filterion = new Filterion<{ price: string }>()
  .add('price', 649);

// Bad
const filterion = new Filterion<{ name: string }>()
  .add('price', 649);

/*
error TS2345: Argument of type '"price"' is not assignable to parameter of type '"name"'.
*/

```

Inspired by [immutable.js](https://github.com/immutable-js/immutable-js), an immutable collections library for JavaScript.

## License
MIT

