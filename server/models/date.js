const { getConnection, select, update } = require('../db')

const isCompleteByDate = 'SELECT is_complete FROM date WHERE date = ?'
const completeDate = 'UPDATE date SET is_complete=1 WHERE date = ?'

class Video {
    constructor() {}

    async isCompleteByDate(date) {
        try {
            const conn = await getConnection()
            const res = await select(conn, isCompleteByDate, [date])
            if (res == null || res.length === 0) {
                return false
            }
            return res[0].is_complete
        } catch (err) {
            console.debug('[isCompleteByDate] error', err)
            return null
        }
    }

    async completeDate(date) {
        try {
            const conn = await getConnection()
            const res = await update(conn, completeDate, [date])
            return res
        } catch (err) {
            console.debug('[completeDate] error', err)
            return null
        }
    }
}

module.exports = Video

