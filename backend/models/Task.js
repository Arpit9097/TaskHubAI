const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a task title'],
    trim: true,
  },
  assignee: {
    type: String,
    required: [true, 'Please add an assignee'],
  },
  deadline: {
    type: Date,
    required: [true, 'Please add a deadline Date'],
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending',
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  dependsOn: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Task'
  }],
  resolutionNotes: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Task', taskSchema);
