import passport from 'passport';
import { Router } from 'express';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from './models/UserSchema';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const router = Router();

interface GoogleLoginUser {
  id: string;
  token: string;
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: 'http://localhost:5000/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log('Google Profile:', profile);

      try {
        if (!profile.emails || profile.emails.length === 0) {
          return done(new Error('No email found for user'), false);
        }

        const email = profile.emails[0].value;
        const firstName = profile.name?.givenName || 'Unknown';
        const lastName = profile.name?.familyName || 'Unknown';

        let user = await User.findOne({ email });

        if (!user) {
          console.log('User not found, creating new user...');
          user = new User({
            firstName,
            lastName,
            email,
            password: '',
            authMethod: 'google',
          });

          await user.save()
            .then((savedUser) => {
              console.log('New user created:', savedUser);
            })
            .catch((error) => {
              console.error('Error saving new user:', error);
              return done(error, false);
            });
        } else {
          console.log('User found:', user);
        }

        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || 'secret', {
          expiresIn: '1d',
        });

        done(null, { id: user._id, token });
      } catch (error) {
        console.error('Error in Google Strategy:', error);
        return done(error, false);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.error('Error deserializing user:', error);
    done(error, null);
  }
});

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const { token } = req.user as GoogleLoginUser;

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    console.log('Google authentication successful, redirecting...');
    res.redirect('http://localhost:5173/selectionpage');
  }
);

export default router;
