const express = require('express')
const router = express.Router()

router.use(require('./daily'))
router.use(require('./schedule'))

module.exports = router
