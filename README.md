<p align="center">
  <img width="200" src="/assets/logo.svg?sanitize=true">
</p>

<h1 align="center">
Filterion

[![Build Status](https://travis-ci.com/prilutskiy/filterion.svg?branch=master)](https://travis-ci.com/prilutskiy/filterion)
[![codecov](https://codecov.io/gh/prilutskiy/filterion/branch/master/graph/badge.svg)](https://codecov.io/gh/prilutskiy/filterion)
[![CodeFactor](https://www.codefactor.io/repository/github/prilutskiy/filterion/badge)](https://www.codefactor.io/repository/github/prilutskiy/filterion)

</h1>

<div align="center">
Immutable data structure for filter criteria management.

</div>

## Install

Install `filterion` using yarn or npm:

```bash
$ yarn add filterion
# or
$ npm i filterion
```

Then require it into any module:

```javascript
import { Filterion } from 'filterion';

const filter = new Filterion()
  .add('device', 'iPhone');

console.log(filter.getPayload());

/*
{
  device: { '=': [ 'iPhone' ] },
  price: { '=': [ 649 ] }
}
*/
```

## Usage with query strings

Simple usage:

```typescript
const query = 'device=iPhone&price=649';

const newQuery = new Filterion()
  .fromQueryString(query)
  .remove('price')
  .add('year', 2007)
  .toQueryString();

console.log(newQuery);

/*
'device=iPhone&year=2007'
*/

```


Advanced usage:

```typescript
const query = 'device=iPhone&price=649';

const newQuery = new Filterion({ operators: ['=', '<', '>'] })
  .fromQueryString(query)
  .add('year', 2007, '>')
  .add('year', 2019, '<')
  .toQueryString();

console.log(newQuery);

/*
'device=iPhone&price=649&year>2007&year<2019'
*/

```
