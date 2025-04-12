// middleware/zodMiddleware.js
const { ZodError } = require("zod");

const validate = ({ body, params, query }) => (req, res, next) => {
  try {
    if (body) req.body = body.parse(req.body);
    if (params) req.params = params.parse(req.params);
    if (query) req.query = query.parse(req.query);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(422).json({
        message: "Validation failed",
        errors: err.errors,
      });
    }
    next(err);
  }
};

module.exports = { validate };
