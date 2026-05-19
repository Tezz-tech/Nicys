const router = require('express').Router()
const upload = require('../middleware/upload')
const ctrl   = require('../controllers/orderController')

// Public routes
router.post('/',              upload.single('paymentProof'), ctrl.createOrder)
router.get('/:id',            ctrl.getOrder)

// Admin routes (add auth middleware in production)
router.patch('/:id/status',   ctrl.updateOrderStatus)
router.get('/',               ctrl.listOrders)

module.exports = router
