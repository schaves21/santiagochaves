import fetch from 'node-fetch';
import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import local from 'passport-local';
import { authService } from '../services/auth.service.js';
import AuthDTO from '../controllers/DTO/auth.dto.js';
import { cartService } from '../services/carts.service.js';
import { createHash, isValidPassword } from '../config.js';
const LocalStrategy = local.Strategy;

export function iniPassport() {
  passport.use(
    'login',
    new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
      try {
        const user = await authService.findUserByEmail({ email: username });

        if (!user) {
          console.log('User Not Found with username (email) ' + username);
          return done(null, false);
        }
        if (!isValidPassword(password, user.password)) {
          console.log('Invalid Password');
          return done(null, false);
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.use(
    'register',
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: 'email',
      },
      async (req, username, password, done) => {
        try {
          const { firstName, lastName, age } = req.body;

          const userExist = await authService.findUserByEmail(username);

          if (userExist) {
            console.log('User already exists');
            return done(null, false);
          }

          const newCart = await cartService.create();
          const cartID = newCart._id.toString();

          const newUser = new AuthDTO({
            firstName,
            lastName,
            email: username,
            age,
            password: createHash(password),
            cartID,
            rol: 'user',
          });

          const userCreated = await authService.create(newUser);

          console.log('User Registration succesful');

          return done(null, userCreated);
        } catch (e) {
          console.log('Error in register');
          console.log(e);
          return done(e);
        }
      }
    )
  );

  passport.use(
    'github',
    new GitHubStrategy(
      {
        clientID: 'Iv1.eb80dff44a07dcdb',
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
      },
      async (accesToken, _, profile, done) => {
        console.log(profile);
        try {
          const res = await fetch('https://api.github.com/user/emails', {
            headers: {
              Accept: 'application/vnd.github+json',
              Authorization: 'Bearer ' + accesToken,
              'X-Github-Api-Version': '2022-11-28',
            },
          });
          const emails = await res.json();
          const emailDetail = emails.find((email) => email.verified == true);

          if (!emailDetail) {
            return done(new Error('cannot get a valid email for this user'));
          }
          profile.email = emailDetail.email;

          let user = await authService.findUserByEmail({
            email: profile.email,
          });
          if (!user) {
            const newCart = await cartService.create();
            const cartID = newCart._id.toString();

            const newUser = {
              email: profile.email,
              firstName: profile._json.name || profile._json.login || 'noname',
              lastName: 'nolast',
              password: 'nopass',
              age: 0,
              cartID,
              rol: 'user',
            };
            let userCreated = await authService.create(newUser);
            console.log('User Registration succesful');
            return done(null, userCreated);
          } else {
            console.log('User already exists');
            return done(null, user);
          }
        } catch (e) {
          console.log('Error en auth github');
          console.log(e);
          return done(e);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await authService.findById(id);
    done(null, user);
  });
}
