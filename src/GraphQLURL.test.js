import { graphql, GraphQLObjectType, GraphQLSchema } from 'graphql'

import GraphQLURL from './GraphQLURL'
import isURL from './isURL'

const noop = () => void 0

const createGraphQLSchema = (queryResolver, mutationResolver = noop) => {
    return new GraphQLSchema({
        query: new GraphQLObjectType({
            name: 'Query',
            fields: {
                url: {
                    type: GraphQLURL,
                    resolve: queryResolver,
                },
            },
        }),
        mutation: new GraphQLObjectType({
            name: 'Mutation',
            fields: {
                setURL: {
                    type: GraphQLURL,
                    args: {
                        url: {
                            type: GraphQLURL,
                        },
                    },
                    resolve: mutationResolver,
                },
            },
        }),
    })
}

describe('GraphQLURL', () => {
    it('should fail serializing', () => {
        const value = 'invalid'
        const schema = createGraphQLSchema(() => value)
        const query = `{ url }`
        return graphql(schema, query).then(result => {
            const errors = result.errors
            expect(errors).toBeDefined()
            expect(errors[0].message).toEqual(`URL can't represent value: ${value}`)
        })
    })

    it('should serialize string value', () => {
        const value = 'http://foo.com/blah_blah_(wikipedia)'
        const schema = createGraphQLSchema(() => {
            return value
        })
        const query = `{ url }`
        return graphql(schema, query).then(result => {
            const url = result.data.url
            expect(url).toEqual(value)
        })
    })

    it('should fail parsing literal', () => {
        const value = 'invalid'
        const schema = createGraphQLSchema(noop, (source, { url }) => {
            return url
        })
        const query = `
      mutation {
        setURL(url:"${value}")
      }
    `
        return graphql(schema, query).then(result => {
            const errors = result.errors
            expect(errors).toBeDefined()
            expect(errors[0].message).toEqual(`Expected URL value but got: ${value}`)
        })
    })

    it('should parse literal string value', () => {
        const value = 'http://foo.com/blah_blah_(wikipedia)'
        const schema = createGraphQLSchema(noop, (source, { url }) => {
            expect(isURL(url)).toEqual(true)
            expect(url).toEqual(value)
            return url
        })
        const query = `
      mutation {
        setURL(url:"${value}")
      }
    `
        return graphql(schema, query).then(result => {
            expect(result.errors).toBeUndefined()
        })
    })

    it('should parse input string value', () => {
        const value = 'http://foo.com/blah_blah_(wikipedia)'
        const schema = createGraphQLSchema(noop, (source, { url }) => {
            expect(isURL(url)).toEqual(true)
            expect(url).toEqual(value)
            return url
        })
        const query = `
      mutation setURL($url:URL!) {
        setURL(url:$url)
      }
    `
        return graphql(schema, query, null, null, { url: value }).then(result => {
            expect(result.errors).toBeUndefined()
        })
    })
})
