const getOrders = (req, res, next) => {
  res.status(200).render("index")
}

module.exports = {
  getOrders,
}
