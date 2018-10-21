const mysql = require('mysql')
const sqlstring = require('sqlstring')

const options = {
    connectionLimit : 50,
    host            : 'mysql',
    user            : 'root',
    password        : 'changeme',
    database        : 'mydb',
    typeCast        : (field, next)  => {
        // We only want to cast bit fields that have a single-bit in them. If the field
        // has more than one bit, then we cannot assume it is supposed to be a Boolean.
        if (field.type === "BIT" && field.length === 1) {
            const bytes = field.buffer()

            // A Buffer in Node represents a collection of 8-bit unsigned integers.
            // Therefore, our single "bit field" comes back as the bits '0000 0001',
            // which is equivalent to the number 1.
            return (bytes[0] === 1)
        }
        return next()
    }
}

const pool = mysql.createPool(options)

const getConnection = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                return reject(err)
            }
            resolve(connection)
        })
    })
}

const sqlMethod = (conn, sql, params) => {
    return new Promise((resolve, reject) => {
        const sanitized = sqlstring.format(sql, params)
        conn.query(sanitized, (err, res) => {
            conn.release()
            if (err) {
                console.debug(sql, sanitized, params, err)
                reject(err)
            }
            resolve(res)
        })
    })
}

module.exports = {
    getConnection: getConnection,
    insert: sqlMethod,
    update: sqlMethod,
    select: sqlMethod,
    delete: sqlMethod,
}

