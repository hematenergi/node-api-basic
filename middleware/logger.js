const logger = (req, res, next) => {
  console.log(`body: ${JSON.stringify(req.body)}`)
  console.log(`params: ${JSON.stringify(req.params)}`)

  return next()
}

module.exports = {
  logger,
}

// request
// mid 1 = next()
// mid 2 = next()
// mid 3 = next()
// handler
