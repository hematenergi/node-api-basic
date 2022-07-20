const fs = require("fs")

const users = JSON.parse(fs.readFileSync("./data/users.json"))
const userExists = users && users.length > 0

const getUser = (req, res, next) => {
  if (userExists) {
    return res.status(200).json({
      message: "Users found",
      data: users,
    })
  } else {
    return res.status(404).json({
      message: "No users found",
    })
  }
}

module.exports = {
  getUser,
}
