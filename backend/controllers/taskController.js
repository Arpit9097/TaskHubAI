const asyncHandler = require('../middlewares/asyncHandler');
const Task = require('../models/Task');
const Audit = require('../models/Audit');
const { GoogleGenerativeAI } = require('@google/generative-ai');

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
  let task = await Task.findById(req.params.id).populate('dependsOn');

  if (!task) {
    return next(new Error(`Task not found with id of ${req.params.id}`));
  }

  // Make sure user is task owner
  if (task.createdBy.toString() !== req.user.id) {
    return next(new Error(`User not authorized to update task`));
  }

  // Check dependencies if marking as Completed
  if (req.body.status === 'Completed' && task.dependsOn && task.dependsOn.length > 0) {
    const pendingDeps = task.dependsOn.filter(dep => dep.status === 'Pending');
    if (pendingDeps.length > 0) {
      await Audit.create({
        message: `Process Exception: Attempted to complete task '${task.title}' but it is blocked by ${pendingDeps.length} pending dependencies.`,
        taskId: task._id
      });
      return next(new Error(`Cannot complete task. ${pendingDeps.length} dependencies are still pending.`));
    }
  }

  // Verification Agent (AI) for Task Completion
  if (req.body.status === 'Completed' && task.status !== 'Completed') {
    if (!req.body.resolutionNotes) {
      await Audit.create({
        message: `Verification Agent rejected: No resolution notes provided for '${task.title}'.`,
        taskId: task._id
      });
      return next(new Error('Please provide resolutionNotes to verify task completion.'));
    }

    if (process.env.GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        
        const prompt = `You are an AI Verification Agent evaluating a task completion.
Task Title: ${task.title}
Resolution Notes: ${req.body.resolutionNotes}

Respond ONLY with valid JSON in this format: { "approved": boolean, "reason": "string" }
Reject if the notes seem completely irrelevant or insufficient. Accept if reasonable effort is shown.`;

        const result = await model.generateContent(prompt);
        let outputText = result.response.text();
        
        if (outputText.startsWith('\`\`\`json')) {
          outputText = outputText.replace(/^\`\`\`json/m, '').replace(/\`\`\`$/m, '').trim();
        } else if (outputText.startsWith('\`\`\`')) {
          outputText = outputText.replace(/^\`\`\`/m, '').replace(/\`\`\`$/m, '').trim();
        }

        const verification = JSON.parse(outputText);

        if (!verification.approved) {
          // Self-correct by preventing completion
          await Audit.create({
            message: `Verification Agent REJECTED completion. Reason: ${verification.reason}`,
            taskId: task._id
          });
          return next(new Error(`Verification Failed: ${verification.reason}`));
        } else {
          await Audit.create({
            message: `Verification Agent APPROVED completion. Reason: ${verification.reason}`,
            taskId: task._id
          });
        }
      } catch (err) {
        console.error("Verification Agent API Error:", err);
      }
    }
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
