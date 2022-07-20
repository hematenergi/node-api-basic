const getOrders = (req, res, next) => {
  res.status(200).render("index")
}

const getOrderDetail = (req, res, next) => {
  const data = {
    id: 1,
    name: "John Doe",
    address: "Jl. Kebon Kacang",
    age: 20,
    hobbies: ["Futsal", "Basket", "Badminton"],
  }

  res.status(200).render("pages/order-detail", data)
}

module.exports = {
  getOrders,
  getOrderDetail,
}
