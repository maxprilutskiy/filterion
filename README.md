<p align="center">
  <img width="200" src="/assets/logo.svg?raw=true">
</p>

<h1 align="center">Filterion</h1>

<div align="center">
A zero-dependencies immutable data structure for filter criteria management.

[![Build Status](https://travis-ci.com/prilutskiy/filterion.svg?branch=master)](https://travis-ci.com/prilutskiy/filterion)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

</div>

## ✨ Features

- 🛡 Written in TypeScript with predictable static types.

## Install

```bash
yarn add filterion
```

## Usage

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
