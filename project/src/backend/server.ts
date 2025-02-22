const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const loginRoute = require('./Login');
const signupRoute = require('./SignUp');
const passportRoute = require('./Passport');
const meRoute = require('./auth');
const profileRoute = require('./Profile');
const cookieParser = require('cookie-parser');
const scoreRoutes = require('./scores');

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
  .catch((err: any) => console.error('❌ MongoDB connection error:', err));

app.use('/api', signupRoute);
app.use('/api', loginRoute);
app.use('/api', passportRoute);
app.use('/api', meRoute);
app.use('/api', profileRoute);
app.use("/api", scoreRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});