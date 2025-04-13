const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ZodError } = require('zod');
const { registerSchema , loginSchema } = require('../validators/authValidation');


// REGISTER CONTROLLER
exports.register = async (req, res, next) => {
    try {
        // Validate the request body using Zod
        registerSchema.parse({ body: req.body });

        const { email, name, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error('User already exists with this email.');
            error.statusCode = 409;
            throw error;
        }

        // Hash password
        const hashedPw = await bcrypt.hash(password, 12);

        // Save new user
        const user = new User({
            email,
            password: hashedPw,
            name
        });

        const result = await user.save();

        res.status(201).json({
            message: 'User created successfully!',
            userId: result._id
        });

    } catch (err) {
        // Handle Zod validation error
        if (err instanceof ZodError) {
            return res.status(400).json({
                message: "Validation failed",
                errors: err.errors,
            });
        }

        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

// LOGIN CONTROLLER
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Validate request body
        loginSchema.parse({ body: req.body });

        const user = await User.findOne({ email });

        if (!user) {
            const error = new Error('User not found.');
            error.statusCode = 401;
            throw error;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const error = new Error('Incorrect password.');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign(
            {
                email: user.email,
                userId: user._id.toString()
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message: 'Login successful!',
            token,
            userId: user._id.toString()
        });

    } catch (err) {
        if (err instanceof ZodError) {
            return res.status(400).json({
                message: "Validation failed",
                errors: err.errors,
            });
        }

        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};
