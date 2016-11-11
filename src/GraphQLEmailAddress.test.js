import {
  graphql,
  GraphQLObjectType,
  GraphQLSchema
} from 'graphql'

import GraphQLEmailAddress from './GraphQLEmailAddress'
import isEmailAddress from './isEmailAddress'

const noop = () => void 0

const createGraphQLSchema = (queryResolver, mutationResolver = noop) => {
  return new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: {
        emailAddress: {
          type: GraphQLEmailAddress,
          resolve: queryResolver
        }
      }
    }),
    mutation: new GraphQLObjectType({
      name: 'Mutation',
      fields: {
        setEmailAddress: {
          type: GraphQLEmailAddress,
          args: {
            emailAddress: {
              type: GraphQLEmailAddress
            }
          },
          resolve: mutationResolver
        }
      }
    })
  })
}

describe('GraphQLEmailAddress', () => {
  it('should fail serializing', () => {
    const value = 'invalid'
    const schema = createGraphQLSchema(() => value)
    const query = `{ emailAddress }`
    return graphql(schema, query)
      .then(result => {
        const errors = result.errors
        expect(errors).toBeDefined()
        expect(errors[0].message).toEqual(
          `EmailAddress can't represent value: ${value}`
        )
      })
  })

  it('should serialize string value', () => {
    const value = 'pvz0dbod5z5ctb@hu370j.com'
    const schema = createGraphQLSchema(() => {
      return value
    })
    const query = `{ emailAddress }`
    return graphql(schema, query)
      .then(result => {
        const emailAddress = result.data.emailAddress
        expect(emailAddress).toEqual(value)
      })
  })

  it('should fail parsing literal', () => {
    const value = 'invalid'
    const schema = createGraphQLSchema(noop, (source, { emailAddress }) => {
      return emailAddress
    })
    const query = `
      mutation {
        setEmailAddress(emailAddress:"${value}")
      }
    `
    return graphql(schema, query)
      .then(result => {
        const errors = result.errors
        expect(errors).toBeDefined()
        expect(errors[0].message).toEqual(
          `Expected email address value but got: ${value}`
        )
      })
  })

  it('should parse literal string value', () => {
    const value = 'f6zs79530hl@vdoxrrpej.com'
    const schema = createGraphQLSchema(noop, (source, { emailAddress }) => {
      expect(isEmailAddress(emailAddress)).toEqual(true)
      expect(emailAddress).toEqual(value)
      return emailAddress
    })
    const query = `
      mutation {
        setEmailAddress(emailAddress:"${value}")
      }
    `
    return graphql(schema, query)
      .then(result => {
        expect(result.errors).toBeUndefined()
      })
  })

  it('should parse input string value', () => {
    const value = 'l2ibwglhx@qaj87fzwc7.com'
    const schema = createGraphQLSchema(noop, (source, { emailAddress }) => {
      expect(isEmailAddress(emailAddress)).toEqual(true)
      expect(emailAddress).toEqual(value)
      return emailAddress
    })
    const query = `
      mutation setEmailAddress($emailAddress:EmailAddress!) {
        setEmailAddress(emailAddress:$emailAddress)
      }
    `
    return graphql(schema, query, null, null, { emailAddress: value })
      .then(result => {
        expect(result.errors).toBeUndefined()
      })
  })
})
