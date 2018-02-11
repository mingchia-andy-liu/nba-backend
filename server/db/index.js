const { Client } = require('pg')
const client = new Client({
    connectionString: process.env.DATABASE_URL,
})

client.connect().then(() => {
    client.query(
        'SELECT $1::text as message',
        ['Connected to the DB'],
        (req, res) => {
            console.log(res.rows[0].message)
            client.end()
        }
    )
})
