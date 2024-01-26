// const asyncHandler = (fn) => (req, res, next) => {
//   return fn(req, res, next).catch(next)
// }

const asyncHandler = (fn) => (req, res, next) => fn(req, res, next).catch(next)

module.exports = asyncHandler
