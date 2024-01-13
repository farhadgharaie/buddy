import express, { Router, Request, Response } from 'express';
import { AuthenticationService } from '../../application/authentication.service';

const authControllerr = (authService: AuthenticationService): Router => {
    const router = express.Router();

    router.post('/login', async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const tokenInfo = await authService.login(email, password);
            res.json(tokenInfo);
        } catch (error) {
            res.status(401).json({ error: (error as Error).message });
        }
    });
    return router
}
export default authControllerr;