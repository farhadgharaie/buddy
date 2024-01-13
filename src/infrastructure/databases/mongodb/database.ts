import mongoose from 'mongoose';

const mongoUrl = 'mongodb://localhost:27017/buddy';
mongoose.connect(mongoUrl);

const db = mongoose.connection;

db.on('connecting', () => console.log('Connecting to MongoDB...'));
db.on('error', (error) => console.error('MongoDB connection error:', error));
db.on('connected', () => console.log('Connected to MongoDB'));

export default mongoose;