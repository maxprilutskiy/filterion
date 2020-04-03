<p align="center">
  <img width="200" src="/assets/logo.svg?sanitize=true">
</p>

<h1 align="center">
Filterion

[![Build Status](https://travis-ci.com/prilutskiy/filterion.svg?branch=master)](https://travis-ci.com/prilutskiy/filterion)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

</h1>

<div align="center">
Immutable data structure for filter criteria management.

</div>

## Install

Install `filterion` using yarn or npm:

```bash
yarn add filterion
# or
npm i filterion
```

Then require it into any module:

```javascript
import { Filterion } from 'filterion';

const filter = new Filterion()
  .add('device', 'iPhone')
  .add('price', 100, '>')
  .add('price', 200, '<');

console.log(filter.payload);

/*
{
  device: { '=': [ 'iPhone' ] },
  price: { '>': [ 100 ], '<': [ 200 ] }
}
*/
```
