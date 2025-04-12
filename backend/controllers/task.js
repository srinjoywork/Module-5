const Task = require('../model/task');
const User = require('../model/user');

const { validationResult } = require('express-validator');


exports.getTasks = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 4;
  let totalItems;
  Task.find({ creator: req.userId }).countDocuments()
    .then(count => {
      totalItems = count;
      return Task.find({ creator: req.userId }).skip((currentPage - 1) * perPage).limit(perPage)
    }).then(tasks => {
      res.status(200).json({
        message: 'Fetched tasks successfully.',
        tasks: tasks,
        totalItems: totalItems
      })
    }
    ).catch(
      err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      }
    )
};

exports.createTask = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('validation failed, entered data is incorrect');
    error.statusCode = 422;
    throw (error);
  }
  const title = req.body.title;
  const subject = req.body.subject;
  const priority = req.body.priority;
  const completed = req.body.completed;
  let creator;
  console.log(req.userId);
  const task = new Task({
    title: title,
    subject: subject,
    priority: parseInt(priority),
    completed: completed,
    creator: req.userId
  });
  task.save()
    .then(() => {
      return User.findById(req.userId);
    })
    .then(user => {
      creator = user;
      user.tasks.push(task);
      return user.save();
    })
    .then(result => {
      res.status(201).json({
        message: 'Task created successfully!',
        task: task,
        creator: { _id: creator._id, name: creator.name }
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteTask = (req, res, next) => {
  const taskId = req.params.id;
  Task.findById(taskId)
    .then(task => {
      if (!task) {
        const error = new Error('Could not find task!');
        error.statusCode = 404;
        throw (error);
      }
      if (task.creator.toString() !== req.userId) {
        const error = new Error('Authorization failed!');
        error.statusCode = 403;
        throw (error);
      }
      return Task.findByIdAndDelete(taskId);
    }).then(result => {
      return User.findById(req.userId)
    })
    .then(user => {
      user.tasks.pull(taskId);
      return user.save();
    })
    .then(result => {
      res.status(200).json({ message: 'task deleted!' });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    })

}

exports.editTask = (req, res, next) => {
  const taskId = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('validation failed, entered data is incorrect');
    error.statusCode = 422;
    throw (error);
  }
  const title = req.body.title;
  const subject = req.body.subject;
  const priority = req.body.priority;
  const completed = req.body.completed;
  Task.findById(taskId)
    .then(task => {
      if (!task) {
        const error = new Error('Could not find task!');
        error.statusCode = 404;
        throw (error);
      }
      if (task.creator.toString() !== req.userId) {
        const error = new Error('Authorization failed!');
        error.statusCode = 403;
        throw (error);
      }
      task.title = title;
      task.subject = subject;
      task.priority = priority;
      task.completed = completed;
      return task.save();
    }).then(result => {
      res.status(200).json({ message: 'task updated!', task: result });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    })
}

exports.completedTask = (req, res, next) => {
  const taskId = req.params.id;
  Task.findById(taskId)
    .then(task => {
      if (task.completed) {
        task.completed = false;
      } else {
        task.completed = true;
      }
      return task.save();
    })
    .then(result => {
      res.status(200).json({ message: 'task updated!' });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    })
}