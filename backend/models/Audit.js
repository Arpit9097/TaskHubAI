const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, 'Please add an audit message'],
  },
  taskId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Task'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Audit', auditSchema);
