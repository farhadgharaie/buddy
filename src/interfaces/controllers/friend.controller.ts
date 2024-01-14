import express, { Router,Request, Response } from 'express';
import { FriendService } from '../../application/friend.service';

const friendController = (friendService: FriendService): Router => {
const router = express.Router();

router.get('/invitations/:userId', async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const invitations = await friendService.getInvitations(userId);
        res.json(invitations);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

router.post('/invite/:senderId/:receiverId', async (req: Request, res: Response) => {
    try {
        const senderId = req.params.senderId;
        const receiverId = req.params.receiverId;
        await friendService.inviteFriend(senderId, receiverId);
        res.json({ message: 'Friend invitation sent successfully' });
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

router.post('/accept/:userId/:inviterId', async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const inviterId = req.params.inviterId;
        await friendService.acceptFriendship(userId, inviterId);
        res.json({ message: 'Friendship accepted successfully' });
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

router.post('/decline/:userId/:inviterId', async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const inviterId = req.params.inviterId;
        await friendService.declineFriendship(userId, inviterId);
        res.json({ message: 'Friendship declined successfully' });
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});
return router;
}
export default friendController;
