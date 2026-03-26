const asyncHandler = require('../middlewares/asyncHandler');
const Task = require('../models/Task');
const Audit = require('../models/Audit');

// @desc    Get all tasks for logged in user
// @route   GET /api/tasks
// @access  Private
exports.getTasks = asyncHandler(async (req, res, next) => {
  const tasks = await Task.find({ createdBy: req.user.id }).sort('-createdAt');
  
  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks
  });
});

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.createdBy = req.user.id;

  const task = await Task.create(req.body);

  // Log creation
  await Audit.create({
    message: `Manual Task created: '${task.title}' assigned to ${task.assignee}`,
    taskId: task._id
  });

  res.status(201).json({
    success: true,
    data: task
  });
});

// @desc    Update task (e.g., mark as completed)
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = asyncHandler(async (req, res, next) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return next(new Error(`Task not found with id of ${req.params.id}`));
  }

  // Make sure user is task owner
  if (task.createdBy.toString() !== req.user.id) {
    return next(new Error(`User not authorized to update task`));
  }

  const oldStatus = task.status;
  task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (req.body.status && req.body.status !== oldStatus) {
    await Audit.create({
      message: `Task '${task.title}' status changed to ${task.status}`,
      taskId: task._id
    });
  }

  res.status(200).json({
    success: true,
    data: task
  });
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new Error(`Task not found with id of ${req.params.id}`));
  }

  if (task.createdBy.toString() !== req.user.id) {
    return next(new Error(`User not authorized to delete task`));
  }

  await task.deleteOne();

  await Audit.create({
    message: `Task deleted: '${task.title}'`
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});
