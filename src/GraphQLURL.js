import { GraphQLScalarType } from 'graphql'
import { GraphQLError } from 'graphql/error'
import { Kind } from 'graphql/language'
import isURL from './isURL'

const coerceURL = value => {
    if (!isURL(value)) {
        const message = `URL can't represent value: ${value}`
        throw new TypeError(message)
    }
    return value
}

const GraphQLURL = new GraphQLScalarType({
    name: 'URL',
    serialize: coerceURL,
    parseValue: coerceURL,
    parseLiteral(valueNode) {
        const { kind, value } = valueNode
        if (kind !== Kind.STRING || !isURL(value)) {
            throw new GraphQLError(`Expected URL value but got: ${value}`, [valueNode])
        }
        return value
    },
})

export default GraphQLURL
