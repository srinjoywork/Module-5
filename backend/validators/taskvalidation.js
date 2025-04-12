// validators/taskValidation.js
const { z } = require("zod");

const taskBodySchema = z.object({
  title: z.string().min(5),
  subject: z.string().min(5),
  priority: z.number().min(1).max(5),
});

const taskParamsSchema = z.object({
  id: z.string().length(24, "Invalid task ID format"),
});

module.exports = {
  taskBodySchema,
  taskParamsSchema,
};
