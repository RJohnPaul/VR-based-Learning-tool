import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import loginRoute from './Login';
import signupRoute from './SignUp';
import passportRoute from './Passport';
import meRoute from './auth'
import profileRoute from './Profile'
import cookieParser from 'cookie-parser';
import scoreRoutes from './scores'

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://prithvie1611:xhgCdDz7oPejSYku@cluster0.rhe97.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/vr-learning-tool')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.use('/api', signupRoute);
app.use('/api', loginRoute);
app.use('/api', passportRoute);
app.use('/api', meRoute)
app.use('/api', profileRoute)
app.use("/api", scoreRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
