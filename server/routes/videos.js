const express = require('express')
const router  = express.Router()
const Video = require('../models/video')

const cache = {}

router.get(
    '/:id',
    async (req, res) => {
        const { id } = req.params
        try {
            if (!id || id.length !== 10 || +id < 1 || isNaN(+id)) {
                res.sendStatus(400)
            } else if (cache[id]) {
                res.send(cache[id])
            } else {
                const v = new Video()
                const vid = await v.FindVideoByGid(id)
                cache[id] = vid
                res.send(vid)
            }
        } catch (err) {
            res.sendStatus(500)
        }
    }
)


module.exports = router
