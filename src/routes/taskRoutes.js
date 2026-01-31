const express = require('express');
const router = express.Router();

const taskController = require('../controllers/taskController');
const { protect } = require('../middleware');

// All routes are protected
router.use(protect);

router.get('/', taskController.getTasks);
router.get('/upcoming', taskController.getUpcomingTasks);
router.get('/overdue', taskController.getOverdueTasks);
router.get('/:id', taskController.getTask);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
