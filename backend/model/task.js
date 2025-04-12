const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    priority: {
      type: Number,
      required: true
    },
    completed: {
      type: Boolean,
      default: false,
      required: true
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      required: true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
