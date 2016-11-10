import {
  graphql,
  GraphQLObjectType,
  GraphQLSchema
} from 'graphql'

import GraphQLDate from './GraphQLDate'
import isDate from './isDate'

const noop = () => void 0

const createGraphQLSchema = (queryResolver, mutationResolver = noop) => {
  return new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: {
        date: {
          type: GraphQLDate,
          resolve: queryResolver
        }
      }
    }),
    mutation: new GraphQLObjectType({
      name: 'Mutation',
      fields: {
        setDate: {
          type: GraphQLDate,
          args: {
            date: {
              type: GraphQLDate
            }
          },
          resolve: mutationResolver
        }
      }
    })
  })
}

describe('GraphQLDate', () => {
  it('should fail serializing', () => {
    const value = 'invalid'
    const schema = createGraphQLSchema(() => value)
    const query = `{ date }`
    return graphql(schema, query)
      .then(result => {
        const errors = result.errors
        expect(errors).toBeDefined()
        expect(errors[0].message).toEqual(
          `Date can't represent non-date value: ${value}`
        )
      })
  })
  it('should serialize integer value', () => {
    const value = 0
    const schema = createGraphQLSchema(() => value)
    const query = `{ date }`
    return graphql(schema, query)
      .then(result => {
        const isoString = result.data.date
        expect(isoString).toEqual((new Date(value)).toISOString())
      })
  })

  it('should serialize string value', () => {
    const value = (new Date()).toISOString()
    const schema = createGraphQLSchema(() => {
      return value
    })
    const query = `{ date }`
    return graphql(schema, query)
      .then(result => {
        const isoString = result.data.date
        expect(isoString).toEqual(value)
      })
  })

  it('should serialize date value', () => {
    const value = new Date()
    const schema = createGraphQLSchema(() => {
      return value
    })
    const query = `{ date }`
    return graphql(schema, query)
      .then(result => {
        const isoString = result.data.date
        expect(isoString).toEqual(value.toISOString())
      })
  })

  it('should fail parsing literal', () => {
    const value = 'invalid'
    const schema = createGraphQLSchema(noop, (source, { date }) => {
      return date
    })
    const query = `
      mutation {
        setDate(date:"${value}")
      }
    `
    return graphql(schema, query)
      .then(result => {
        const errors = result.errors
        expect(errors).toBeDefined()
        expect(errors[0].message).toEqual(
          `Expected date value but got: ${value}`
        )
      })
  })

  it('should parse literal integer value', () => {
    const value = 0
    const schema = createGraphQLSchema(noop, (source, { date }) => {
      expect(isDate(date)).toEqual(true)
      expect(date.valueOf()).toEqual(value)
      return date
    })
    const query = `
      mutation {
        setDate(date:${value})
      }
    `
    return graphql(schema, query)
      .then(result => {
        expect(result.errors).toBeUndefined()
      })
  })

  it('should parse literal string value', () => {
    const value = (new Date()).toISOString()
    const schema = createGraphQLSchema(noop, (source, { date }) => {
      expect(isDate(date)).toEqual(true)
      expect(date.toISOString()).toEqual(value)
      return date
    })
    const query = `
      mutation {
        setDate(date:"${value}")
      }
    `
    return graphql(schema, query)
      .then(result => {
        expect(result.errors).toBeUndefined()
      })
  })

  it('should parse input integer value', () => {
    const value = 0
    const schema = createGraphQLSchema(noop, (source, { date }) => {
      expect(isDate(date)).toEqual(true)
      expect(date.valueOf()).toEqual(value)
      return date
    })
    const query = `
      mutation setData($date:Date!) {
        setDate(date:$date)
      }
    `
    return graphql(schema, query, null, null, { date: value })
      .then(result => {
        expect(result.errors).toBeUndefined()
      })
  })

  it('should parse input string value', () => {
    const value = (new Date()).toISOString()
    const schema = createGraphQLSchema(noop, (source, { date }) => {
      expect(isDate(date)).toEqual(true)
      expect(date.toISOString()).toEqual(value)
      return date
    })
    const query = `
      mutation setData($date:Date!) {
        setDate(date:$date)
      }
    `
    return graphql(schema, query, null, null, { date: value })
      .then(result => {
        expect(result.errors).toBeUndefined()
      })
  })
})
