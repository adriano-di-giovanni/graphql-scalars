import { GraphQLScalarType } from 'graphql'
import { GraphQLError } from 'graphql/error'
import { Kind } from 'graphql/language'
import isDate from './isDate'

const coerceDate = (value) => {
  const date = new Date(value)
  if (!isDate(date)) {
    const message = `Date can't represent non-date value: ${value}`
    throw new TypeError(message)
  }
  return date
}

const GraphQLDate = new GraphQLScalarType({
  name: 'Date',
  serialize: value => coerceDate(value).toISOString(),
  parseValue: coerceDate,
  parseLiteral (valueNode) {
    const { kind, value } = valueNode
    let date
    switch (kind) {
      case Kind.INT:
      case Kind.FLOAT:
        date = new Date(+value)
        break
      case Kind.STRING:
        date = new Date(value)
        break
      default:
    }
    if (!isDate(date)) {
      throw new GraphQLError(`Expected date value but got: ${value}`,
        [valueNode])
    }
    return date
  }
})

export default GraphQLDate
