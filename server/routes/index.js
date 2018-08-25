const express = require('express')
const router = express.Router()

router.use('/v', require('./videos'))

module.exports = router
