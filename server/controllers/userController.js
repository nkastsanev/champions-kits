import { Router } from 'express';
import userService from '../services/userService.js';
import authMiddleware from '../middlewares/authMiddleware.js'
import adminMiddleware from '../middlewares/adminMiddleware.js';

const userController = Router();

userController.get('/', async (req, res) => {
    const { search, role, page = 1, pageSize = 10 } = req.query;

    try {
        const result = await userService.getAllUsers(
            search || null,
            role !== undefined ? Number(role) : null,
            Number(page),
            Number(pageSize)
        );

        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ message: 'Error retrieving users.' });
    }
});

userController.post('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        const user = await userService.register(firstName, lastName, email, password)
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

userController.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await userService.login(email, password);
        res.status(200).json({
            token: result.token,
            user: result.user,
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

userController.post('/logout', authMiddleware, (req, res) => {
    res.json({ message: 'Logged out successfully' });
});


userController.get('/profile', authMiddleware, async (req, res) => {
    const { id } = req.user;

    try {
        const user = await userService.getUserById(id);
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ message: 'User not found.' })
    }
});

userController.put('/profile/change-password', authMiddleware, async (req, res) => {
    const { id } = req.user;
    const { oldPassword, newPassword } = req.body;

    try {
        await userService.changePassword(id, oldPassword, newPassword);
        res.status(200).json({ message: 'Password updated successfully!' })
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

userController.get('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        const user = await userService.getUserById(id);
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ message: 'User not found.' })
    }
});

userController.put('/:id/role', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    await userService.changeRole(req.user, id, role);
    res.status(200).json({ message: 'Role updated' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default userController;