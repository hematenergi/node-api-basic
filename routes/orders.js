const { getOrders, getOrderDetail } = require("../controllers/orders")

const router = require("express").Router()

router.get("/", getOrders)
router.get("/detail", getOrderDetail)

module.exports = router
