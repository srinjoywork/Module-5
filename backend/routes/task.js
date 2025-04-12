const express = require('express');
const { body } = require('express-validator')

const taskController = require('../controllers/task');
const isAuth = require('../middleware/is-auth')

const router = express.Router();

router.get('/tasks', isAuth, taskController.getTasks);

router.post('/task', isAuth, [
    body('title').trim().isLength({ min: 5 }),
    body('subject').trim().isLength({ min: 5 }),
    body('priority').isInt({ min: 1, max: 5 })
], taskController.createTask);

router.put('/task/:id', isAuth, [
    body('title').trim().isLength({ min: 5 }),
    body('subject').trim().isLength({ min: 5 }),
    body('priority').isInt({ min: 1, max: 5 })
], taskController.editTask)

router.delete('/task/:id', isAuth, taskController.deleteTask);

router.put('/taskComplete/:id', isAuth, taskController.completedTask);

module.exports = router;

