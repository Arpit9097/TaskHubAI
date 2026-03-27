const cron = require('node-cron');
const Task = require('../models/Task');
const Audit = require('../models/Audit');

// Run every minute for the hackathon demo. In production, maybe hourly ('0 * * * *')
cron.schedule('* * * * *', async () => {
    console.log('[Health Monitor] Checking for SLA breaches and process drift...');
    try {
        const today = new Date();
        
        // Find tasks that missed SLA and are not yet escalated to High priority
        const delayedTasks = await Task.find({
            status: 'Pending',
            deadline: { $lt: today },
            priority: { $ne: 'High' }
        });

        if (delayedTasks.length > 0) {
            console.log(`[Health Monitor] Found ${delayedTasks.length} stalled tasks. Initiating self-correction...`);
            
            for (let task of delayedTasks) {
                // Self-correct by escalating priority
                task.priority = 'High';
                await task.save();

                // Create permanent audit log of the agentic action
                await Audit.create({
                    message: `Workflow Health Monitor: Task '${task.title}' missed SLA. Auto-escalated priority to High.`,
                    taskId: task._id
                });
                console.log(`[Health Monitor] Escalated task ID: ${task._id}`);
            }
        }
    } catch (error) {
        console.error('[Health Monitor] Error running SLA monitor:', error);
    }
});

module.exports = cron;
