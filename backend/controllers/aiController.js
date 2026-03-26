const asyncHandler = require('../middlewares/asyncHandler');
const Task = require('../models/Task');
const Audit = require('../models/Audit');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// @desc    Analyze meeting transcript and generate automated workflow via Gemini AI
// @route   POST /api/analyze
// @access  Private
exports.analyzeTranscript = asyncHandler(async (req, res, next) => {
  const { text } = req.body;

  if (!text) {
    return next(new Error('Please provide meeting transcript text'));
  }

  // Ensure user has API KEY in ENV
  if (!process.env.GEMINI_API_KEY) {
    return next(new Error('GEMINI_API_KEY is not defined in the backend environment variables'));
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `You are an intelligent AI task extraction agent in a workflow automation system.

Your job is to analyze a meeting transcript and extract ONLY actionable tasks.

Return STRICTLY valid JSON (no explanation, no extra text).

Output format:
[
  {
    "title": "short task title",
    "assignee": "person responsible or 'Team'",
    "deadline": "ISO date (YYYY-MM-DD) or relative like '2 days'",
    "priority": "High | Medium | Low"
  }
]

Rules:
- Extract only actionable tasks (ignore discussions, greetings, opinions)
- Keep task titles short and clear
- If assignee is not mentioned -> assign "Team"
- If deadline is not mentioned -> estimate intelligently (1-5 days based on urgency)
- If urgency words like "urgent", "ASAP", "immediately" appear -> set priority = High
- If task is normal -> Medium
- If optional or low importance -> Low

Important:
- Do NOT include any explanation
- Do NOT include markdown
- Output must be directly parsable JSON array

Meeting Transcript:
${text}`;

    const result = await model.generateContent(prompt);
    let outputText = result.response.text();
    
    // Clean up potential markdown code blocks returned by AI
    if (outputText.startsWith('```json')) {
      outputText = outputText.replace(/^```json/m, '').replace(/```$/m, '').trim();
    } else if (outputText.startsWith('```')) {
      outputText = outputText.replace(/^```/m, '').replace(/```$/m, '').trim();
    }

    const aiTasks = JSON.parse(outputText);
    const createdTasks = [];
    
    // Iterate over generated AI tasks, saving each to MongoDB and tracking Audit logs
    for (let aiTask of aiTasks) {
      
      // Parse dates properly
      let parsedDate = Date.now() + 2 * 24 * 60 * 60 * 1000; // default 2 days if parsing fails
      if (aiTask.deadline.includes('days') || aiTask.deadline.includes('day')) {
        const days = parseInt(aiTask.deadline.split(' ')[0]) || 2;
        parsedDate = Date.now() + days * 24 * 60 * 60 * 1000;
      } else if (!isNaN(Date.parse(aiTask.deadline))) {
        parsedDate = Date.parse(aiTask.deadline);
      }
      
      const deadlineObj = new Date(parsedDate);

      // Create Task dynamically mapped to our DB Schema
      const task = await Task.create({
        title: aiTask.title,
        assignee: aiTask.assignee,
        deadline: deadlineObj,
        priority: aiTask.priority,
        status: 'Pending',
        createdBy: req.user.id
      });
      
      // Generate explicit Audit logs representing multi-agent process
      await Audit.create({
        message: `Extraction Agent found action item: '${task.title}'`,
        taskId: task._id
      });
      
      await Audit.create({
        message: `Assignment Agent matched '${task.title}' to -> ${task.assignee}`,
        taskId: task._id
      });
      
      await Audit.create({
        message: `Deadline Agent calculated due date for '${task.title}' -> ${deadlineObj.toDateString()}`,
        taskId: task._id
      });
      
      await Audit.create({
        message: `Priority Agent scored Task priority -> ${task.priority}`,
        taskId: task._id
      });

      createdTasks.push(task);
    }

    res.status(200).json({
      success: true,
      message: `Workflow pipeline complete. ${createdTasks.length} tasks generated.`,
      data: createdTasks
    });

  } catch (error) {
    console.error("AI Generation Error:", error);
    return next(new Error('Failed to parse AI output or Gemini API error. Please try again.'));
  }
});
