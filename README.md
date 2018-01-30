# graphql-scalars

> Custom [scalars](http://graphql.org/learn/schema/#scalar-types) for GraphQL.

Currently available scalars:

* [GraphQLDate](#GraphQLDate)
* [GraphQLEmailAddress](#GraphQLEmailAddress)
* [GraphQLURL](#GraphQLURL)

## Installation

```bash
npm install graphql-scalars --save
```

## GraphQLDate <a name="GraphQLDate" />

This custom scalar for GraphQL parses any integer, float, string or date value to javascript dates.

`GraphQLDate` uses `new Date()` to parse values so, please refer to the  [documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) for more details.

`GraphQLDate` serializes dates to ISO 8601 strings.

### Usage

```javascript
import {
  graphql,
  GraphQLObjectType,
  GraphQLSchema
} from 'graphql'

import { GraphQLDate } from 'graphql-scalars'

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
      createdAt: {
        type: GraphQLDate,
        resolve () {
          // Resolver can return an integer, string or date value.
          // The following return values all resolve to the same date.
          // `return 262915200000`
          // `return '1978-05-02'`
          // `return '1978-05-02T00:00:00.000Z'`
          return new Date('1978-05-02')
        }
      }
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'RootMutation',
    fields: {
      setCreatedAt: {
        type: GraphQLDate,
        args: {
          createdAt: {
            type: GraphQLDate
          }
        },
        resolve (source, { createdAt }) {
          // `createdAt` is a javascript date
          return createdAt
        }
      }
    }
  })
})

const query = `
  {
    createdAt
  }
`

graphql(schema, query)
  .then(result => {
    const isoString = result.data.createdAt
    console.log(isoString) // 1978-05-02T00:00:00.000Z
  })

// literals for GraphQLDate can be any integer or string value
// `setCreatedAt(createdAt:262915200000)`
// `setCreatedAt(createdAt:"1978-05-02")`
// `setCreatedAt(createdAt:"1978-05-02T00:00:00.000Z")`
const mutation = `
  mutation {
    setCreatedAt(createdAt:"1978-05-02")
  }
`

graphql(schema, query)
  .then(result => {
    const isoString = result.data.createdAt
    console.log(isoString) // 1978-05-02T00:00:00.000Z
  })
```

## GraphQLEmailAddress <a name="GraphQLEmailAddress" />

`GraphQLEmailAddress` uses the regular expression as per HTML5 specification to
validate input email addresses.

## GraphQLURL <a name="GraphQLURL" />

`GraphQLURL` uses the [regular expression](https://gist.github.com/dperini/729294) by [Diego Perini](https://github.com/dperini).

## License

`graphql-scalars` is [MIT-licensed](https://github.com/adriano-di-giovanni/graphql-scalars/blob/master/LICENSE).
