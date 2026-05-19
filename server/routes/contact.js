const router = require('express').Router()
const { createContact } = require('../controllers/contactController')

router.post('/', createContact)

module.exports = router
