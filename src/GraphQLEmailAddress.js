import { GraphQLScalarType } from 'graphql'
import { GraphQLError } from 'graphql/error'
import { Kind } from 'graphql/language'
import isEmailAddress from './isEmailAddress'

const coerceEmailAddress = value => {
  if (!isEmailAddress(value)) {
    const message = `EmailAddress can't represent value: ${value}`
    throw new TypeError(message)
  }
  return value
}

const GraphQLEmailAddress = new GraphQLScalarType({
  name: 'EmailAddress',
  serialize: coerceEmailAddress,
  parseValue: coerceEmailAddress,
  parseLiteral (valueNode) {
    const { kind, value } = valueNode
    if (kind !== Kind.STRING || !isEmailAddress(value)) {
      throw new GraphQLError(`Expected email address value but got: ${value}`,
        [valueNode])
    }
    return value
  }
})

export default GraphQLEmailAddress
