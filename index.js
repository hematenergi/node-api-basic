// import and required modules
require("dotenv").config()
require("express-group-routes")
const express = require("express")
const fs = require("fs")
const winston = require("winston")
const path = require("path")
// controllers
const { getUser } = require("./controllers/users")
const { getOrders } = require("./controllers/orders")

const { combine, timestamp, label, printf } = winston.format

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`
})

const logger = winston.createLogger({
  level: "info",
  // format: winston.format.json(),
  format: combine(label({ label: "right meow!" }), timestamp(), myFormat),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
  ],
})

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  )
}

const app = express()

// default route
// app.get("/", (req, res) => {
//   return res.send("Hello Dany")
// })

// port
const PORT = process.env.PORT || 8000

// middleware list
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use("/public", express.static(path.join(".", "public")))
app.set("view engine", "ejs")

app.group("/api/v1", (router) => {
  // get all users middleware route
  router.use("/users", getUser)
})

// testing view engines
app.use(getOrders)

// users.txt
const users = JSON.parse(fs.readFileSync("./data/users.json"))
const userExists = users && users.length > 0

// add user
app.post("/users", (req, res, next) => {
  const newUser = {
    id: users.length + 1,
    full_name: req.body.full_name,
    address: req.body.address,
    age: req.body.age,
  }
  users.push(newUser)
  fs.writeFileSync("./data/users.json", JSON.stringify(users))
  return res.status(201).json({
    message: "User created",
    data: newUser,
  })
})

// update existing user
app.patch("/users/:id", (req, res, next) => {
  console.log(req.params.id)
  console.log(req.body)

  let usersAsString = fs.readFileSync(USER_DATA_PATH).toString()

  // parse data string jadi json
  const users = JSON.parse(usersAsString)

  // nyari data dengan id tertentu ada atau engga
  const indexOfDataExist = users.findIndex(
    (user) => Number(user.id) === Number(req.params.id)
  )

  // kalo ngga ada respon data not found
  if (indexOfDataExist < 0) {
    return res.status(404).json({
      message: "user with this id not found",
    })
  }

  // kalo ada, kita update data dari request
  // if (req.body.full_name) {
  //     users[indexOfDataExist].full_name = req.body.full_name
  // }

  // if (req.body.address) {
  //     users[indexOfDataExist].address = req.body.address
  // }

  // if (req.body.age) {
  //     users[indexOfDataExist].age = req.body.age
  // }
  users[indexOfDataExist] = {
    ...users[indexOfDataExist],
    ...req.body,
  }

  // konversi data array/object ke string
  usersAsString = JSON.stringify(users)

  // save ulang data ke users.json
  fs.writeFileSync(USER_DATA_PATH, usersAsString)

  return res.status(200).json({
    message: "user berhasil diupdate",
    data: users,
  })
})

// delete user
app.delete("/users/:id", (req, res, next) => {
  let usersAsString = fs.readFileSync(USER_DATA_PATH).toString()

  // parse data string jadi json
  const users = JSON.parse(usersAsString)

  // cari datanya by id
  const indexOfDataExist = users.findIndex(
    (user) => Number(user.id) === Number(req.params.id)
  )

  // datanya ga ketemu => respon not found
  if (indexOfDataExist < 0) {
    return res.status(404).json({
      message: "user with this id not found",
    })
  }

  // kalo datanya ketemu baru kita hapus data tersebut
  users.splice(indexOfDataExist, 1)

  // konversi data array/object ke string
  usersAsString = JSON.stringify(users)

  // simpan data ke users.json
  fs.writeFileSync(USER_DATA_PATH, usersAsString)

  // dimunculin respon bahwa data berhasil dihapus
  return res.status(200).json({
    message: "success remove user",
  })
})

// 404 middleware
app.use("*", (req, res, next) =>
  res.status(404).json({ message: "endpoint not found" })
)

// error middleware
app.use((err, req, res, next) => {
  logger.error(JSON.stringify(err.message))
  console.log(err)

  return res
    .status(err?.code || 500)
    .json({ message: err?.message || "Internal server error" })
})

// throw {
//   code: 404,
//   message: "endpoint not found",
// }

app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`)
})
