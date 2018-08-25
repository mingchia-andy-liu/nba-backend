const express = require('express')
const router  = express.Router()
const Video = require('../models/video')

router.get(
    '/:id',
    async (req, res) => {
        const { id } = req.params
        try {
            if (!id || +id < 1) throw Error ('video id not found')
            const v = new Video()
            const vid = await v.FindVideoByGid(id)
            res.send(vid)
        } catch (err) {
            res.sendStatus(500)
        }
    }
)


module.exports = router
