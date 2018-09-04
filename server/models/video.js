const { getConnection, select, insert } = require('../db')

const findByGidQuery = 'SELECT video_id FROM video WHERE game_id = ?'
const InsertVideoIdByGidQuery = `INSERT INTO video (game_id, video_id) VALUES (?, ?)`

class Video {
    constructor() {}

    async FindVideoByGid(gid) {
        try {
            const conn = await getConnection()
            const res = await select(conn, findByGidQuery, [gid])
            return res
        } catch (err) {
            console.debug('[FindVideoByGid] error', err)
            return null
        }
    }

    async InsertVideoIdByGid(gid, vid) {
        try {
            const conn = await getConnection()
            const res = await insert(conn, InsertVideoIdByGidQuery, [gid, vid])
            return res
        } catch (err) {
            console.debug('[InsertVideoIdByGid] error', err)
            return null
        }
    }
}

module.exports = Video

