import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import homeroute from './routes/home.route.js'
import bookingRoutes from './routes/booking.routes.js'
import wishlist from './routes/wishlist.routes.js'
import ledger from './routes/ledger.route.js'
import reviewRoutes from './routes/review.routes.js';

import { connectDB } from './lib/connectDB.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000
console.log("ENV TEST:", process.env.CLOUDINARY_API_KEY);
app.use(cors({ 
    origin: "http://localhost:5173", 
    credentials: true
}))

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.use("/api/home", homeroute);
app.use("/api/booking", bookingRoutes);
app.use("/api/wishlist", wishlist);
app.use("/api/ledger", ledger);
app.use("/api/review", reviewRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log(`server is running in port ${PORT}`);
});
  