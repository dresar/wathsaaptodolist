const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const userController = require('../controllers/userController');
const categoryController = require('../controllers/categoryController');
const taskController = require('../controllers/taskController');

// Rute untuk pengguna
router.post('/users/register', userController.register);
router.post('/users/login', userController.login);
router.get('/users/profile', verifyToken, userController.getProfile);
router.post('/users/logout', verifyToken, userController.logout);

// Rute untuk kategori
router.get('/categories', verifyToken, categoryController.getAllCategories);
router.post('/categories', verifyToken, categoryController.createCategory);
router.put('/categories/:id', verifyToken, categoryController.updateCategory);
router.delete('/categories/:id', verifyToken, categoryController.deleteCategory);

// Rute untuk tugas
router.get('/tasks', verifyToken, taskController.getAllTasks);
router.get('/tasks/:id', verifyToken, taskController.getTaskById);
router.post('/tasks', verifyToken, taskController.createTask);
router.put('/tasks/:id', verifyToken, taskController.updateTask);
router.patch('/tasks/:id/status', verifyToken, taskController.updateTaskStatus);
router.delete('/tasks/:id', verifyToken, taskController.deleteTask);

module.exports = router;