class CustomError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.message = message;
  }
}



const errorMiddleware = (err, req, res, next) => {
  res.status(err.status || 500).json({
    code: err.code || 500,
    message: err.message || "Internal Server Error",
  });
}


const CustomErrorMiddleware = (req, res, next) => {
  res.locals.error = new CustomError(500, "Internal Server Error");
  next();
}


export { CustomErrorMiddleware, errorMiddleware };