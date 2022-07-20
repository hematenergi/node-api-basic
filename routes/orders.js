const { getOrders } = require("../controllers/orders")

const router = require("express").Router()

router.get("/", getOrders)
