import createHttpError from "http-errors"

export const OwnerMiddleware = (req, res, next) => {
  if (req.user.role === "owner") {
    next()
  } else {
    next(createHttpError(403, "owner only!"))
  }
}