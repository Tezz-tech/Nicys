const router = require('express').Router()
const upload = require('../middleware/upload')
const ctrl   = require('../controllers/orderController')

// Public routes
router.post('/',
  upload.fields([
    { name: 'letterImages',  maxCount: 5 },
    { name: 'paymentProof',  maxCount: 1 },
  ]),
  ctrl.createOrder
)
router.get('/:id', ctrl.getOrder)

// Admin routes
router.patch('/:id/status', ctrl.updateOrderStatus)
router.get('/',             ctrl.listOrders)

module.exports = router
