const asyncHandler = require('../middlewares/asyncHandler');
const Task = require('../models/Task');
const Audit = require('../models/Audit');

// @desc    Get all delayed alerts via smart tracking logic
// @route   GET /api/alerts
// @access  Private
exports.getAlerts = asyncHandler(async (req, res, next) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Logic: deadline < current date AND status === Pending AND belongs to the user
  const delayedTasks = await Task.find({
    createdBy: req.user.id,
    status: 'Pending',
    deadline: { $lt: today }
  });

  // Automatically log delay detections to Audit (if not already logged recently)
  // For the sake of the hackathon demo, we just log it
  for (let task of delayedTasks) {
    // Avoid spamming audit logs on every GET request in real world, 
    // but for demo, it's fine or we can check existence first.
    const exists = await Audit.findOne({ taskId: task._id, message: { $regex: /Delay detected/i }});
    if (!exists) {
      await Audit.create({
        message: `System Alert: Delay detected for task '${task.title}'. Deadline passed on ${task.deadline.toDateString()}`,
        taskId: task._id
      });
    }
  }

  res.status(200).json({
    success: true,
    count: delayedTasks.length,
    data: delayedTasks
  });
});
