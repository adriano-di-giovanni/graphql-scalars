const toString = Object.prototype.toString

const isDate = value => {
    return toString.call(value) === '[object Date]' && !isNaN(value.valueOf())
}

export default isDate
