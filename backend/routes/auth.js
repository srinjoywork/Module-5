const express = require('express');
const router = express.Router();

// Controllers
const authController = require('../controllers/auth');

// Middleware
const { validate } = require('../middleware/zodMiddleware');

// Zod Schemas
const { registerSchema, loginSchema } = require('../validators/authValidation');

// Register Route
router.post('/register', validate(registerSchema), authController.register);

// Login Route
router.post('/login', validate(loginSchema), authController.login);

module.exports = router;
