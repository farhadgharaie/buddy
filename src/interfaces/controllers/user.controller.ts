
import express, { Router, Request, Response } from 'express';
import { UserService } from '../../application/user.service';

const userController = (userService: UserService): Router => {
    const router = express.Router();

    router.post('/register', async (req: Request, res: Response) => {
        try {
            const { email, firstName, lastName, birthdate, password } = req.body;
            const user = await userService.register(email, firstName, lastName, birthdate, password);
            res.json(user);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    });
    return router;
};

export default userController;
