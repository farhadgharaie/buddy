import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import userController from './src/interfaces/controllers/user.controller';
import friendController from './src/interfaces/controllers/friend.controller';
import authController from './src/interfaces/controllers/authentication.controller';
import { MongoDBUserRepository } from './src/infrastructure/databases/mongodb/mongodb.user.repository';
import { UserRepository } from './src/domain/user.repository';
import { UserService } from './src/application/user.service';
import { FriendService } from './src/application/friend.service';
import { AuthenticationService } from './src/application/authentication.service';

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('your-mongodb-connection-string', { });

// Create instances of services and repositories
const userRepository: UserRepository = new MongoDBUserRepository();
const userService = new UserService(userRepository);
const friendService = new FriendService(userRepository);
const authService = new AuthenticationService(userRepository);

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Routes
app.use('/user', userController(userService));
app.use('/friend', friendController(friendService));
app.use('/auth', authController(authService));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});