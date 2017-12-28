const express = require('express')
const router = express.Router()


router.get(
    '/daily',
    (req, res) => {
        res.send({ hello: 'world' })
    }
)

router.get(
    '/game/:id',
    (req, res) => {
        res.send({ game: 'on' })
    }
)

module.exports = router
