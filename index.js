import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config({
	path: "./.env",
});
import express from "express";
import connectDB from "./config/connection.js"
import authRoutes from './routes/auth.js';

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use('/users', authRoutes);

app.use(express.urlencoded({extended:true}));
app.use(express.json());

// Central error handler
app.use((err, req, res, next) => {
console.error(err.stack);
res.status(500).json({ message: 'Server error', error: err.message });
});

app.listen(PORT, () => {
	console.log(`The server is running on localhost:${PORT}`);
});
