const { getConnection, select } = require('../db')

const findByGidQuery = 'SELECT video_id FROM video WHERE video.game_id = ?'

class Video {
    constructor() {
    }

    async FindVideoByGid(gid) {
        try {
            const conn = await getConnection()
            const res = await select(conn, findByGidQuery, [gid])
            return res
        } catch (err) {
            throw err
        }
    }
}

module.exports = Video

