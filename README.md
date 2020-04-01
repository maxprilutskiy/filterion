# Filter Criteria

Filter criteria builder

Example:

```typescript
const filter = new Filterion()
  .add('name', 'Max')
  .add('city', 'Minsk')
  .add('date', 'yesterday', '>')
  .add('date', 'tomorrow', '<');

console.log(filter);

/*
{
  name: { '=': [ 'Max' ] },
  city: { '=': [ 'Minsk' ] },
  date: { '>': [ 'yesterday' ], '<': [ 'tomorrow' ] }
}
*/
```
