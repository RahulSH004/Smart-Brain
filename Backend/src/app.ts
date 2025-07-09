import express from 'express';
import authrouter from './routes/auth';
import './config';
import { connectDB } from './db';

const app = express();
const PORT = process.env.PORT;

connectDB();

app.use(express.json());
app.use('/api/v1/auth',authrouter)

app.get('/', (req, res) => {
    res.json({ message: 'Smart Brain API is running!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});