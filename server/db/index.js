const mysql = require('mysql')
const sqlstring = require('sqlstring')

const options = {
    connectionLimit : 50,
    host            : 'mysql',
    user            : 'root',
    password        : 'changeme',
    database        : 'mydb'
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
                console.log(sql, sanitized, params, err)
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

