/* eslint-disable indent */
export function eachTypeToString(value) {
    if (typeof value === 'string') {
        return `'${value}'`
    }
    if (typeof value === 'object') {
        return JSON.stringify(value)
    }
    return value
}

export function objectToString(obj) {
    let res = ''

    if (Object.prototype.toString.call(obj) === '[object Array]') {
        res = `[${obj.map(o => objectToString(o))},
                    ]`

        return res
    }
    res = `\r                        {${Object.keys(obj).map(
    key => `
                            ${key}: ${eachTypeToString(obj[key])}`
)},
                        }`

    return res
}
