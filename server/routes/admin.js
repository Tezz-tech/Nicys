const router    = require('express').Router()
const adminAuth = require('../middleware/adminAuth')
const ctrl      = require('../controllers/adminController')

// Public — login only
router.post('/login', ctrl.login)

// All routes below require JWT
router.use(adminAuth)

router.get('/stats',              ctrl.getStats)
router.get('/orders',             ctrl.listOrders)
router.get('/orders/:id',         ctrl.getOrder)
router.patch('/orders/:id/status', ctrl.updateStatus)
router.get('/contacts',           ctrl.listContacts)

module.exports = router
