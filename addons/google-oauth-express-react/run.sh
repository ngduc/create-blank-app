#!/bin/bash
echo --- install Google OAuth to an existing Backend Express project.

# STEP 1 - install Prisma and init (generate .env and other files)
npm install google-auth-library jsonwebtoken --save-dev

# STEP 2 - add a route example /users: src/routeAuth.ts
FILE1="src/routeAuth.ts"
echo $FILE1
[ -f $FILE1 ] && echo \> file existed: overriding.
cat > $FILE1 <<EOL
import { OAuth2Client, UserRefreshClient } from 'google-auth-library';
import express from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';

// in the main server file, import this file to use it: app.use('/', routeAuth);
const router = express.Router();

const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_OAUTH_CLIENT_ID,
  process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  'postmessage'
);

async function getJwtUser(req: Request, res: Response) {
  const authHeader = req.headers.authorization; // Bearer xxx
  const jwtToken = authHeader && authHeader.split(' ')[1];
  if (!jwtToken) {
    return res.status(401).json({ message: 'No jwt token provided' });
  }
  try {
    const user = await jwt.verify(jwtToken, process.env.JWT_SECRET);
    return user as jwt.JwtPayload;
  } catch (e) {
    console.error(e);
    res.status(403).json({ message: 'Invalid jwt token' });
    return null;
  }
}

router.post('/api/auth/google', async (req, res) => {
  try {
    const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens
    console.log(tokens);

    const { data: userInfo } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    });
    console.log('userInfo', userInfo);
    const jwtToken = jwt.sign(userInfo, process.env.JWT_SECRET, { expiresIn: '1800s' });

    res.json({ tokens, jwtToken, userInfo });
  } catch (e) {
    res.json({ error: 'FAILED /api/auth/google' });
  }
});

router.get('/api/auth/userinfo', async (req, res) => {
  // this decodes 'Bearer jwtToken' to get userinfo without DB/Network requests.
  const user = (await getJwtUser(req, res)) as any;
  if (!user) {
    return res.status(404).json({ error: 'FAILED to get user info' });
  }
  return res.status(200).json({ user });
});

router.post('/api/auth/google/refresh-token', async (req, res) => {
  const user = new UserRefreshClient(
    process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    req.body.refreshToken
  );
  const { credentials } = await user.refreshAccessToken(); // optain new tokens
  res.json(credentials);
});

export default router;
EOL

# STEP 3 - add a react example of ProtectedPage.tsx
mkdir -p ./ui/src/pages/
FILE2="./ui/src/pages/ProtectedPage.tsx"
echo $FILE2
[ -f $FILE2 ] && echo \> file existed: overriding.
cat > $FILE2 <<EOL
import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const ProtectedPage = (props: any) => {
  const { user, jwtToken, setJwtToken } = useAppContext();

  const googleLogin = useGoogleLogin({
    onSuccess: async ({ code }) => {
      const { data: tokensData } = await axios.post('/api/auth/google', {
        code
      });
      console.log('tokensData', tokensData);
      localStorage.setItem('tk', tokensData.jwtToken);

      // try to get /userinfo with jwtToken
      const {
        data: { user }
      } = await axios.get('/api/auth/userinfo', {
        headers: {
          authorization: `Bearer ${localStorage.getItem('tk')}`
        }
      });
      localStorage.setItem('user', JSON.stringify(user));
      setJwtToken ? setJwtToken(tokensData.jwtToken) : '';
      console.log('user', user);
    },
    flow: 'auth-code'
  });

  return jwtToken ? (
    props.children
  ) : (
    <div>
      <button onClick={() => googleLogin()}>Login with Google</button>
    </div>
  );
};

export default ProtectedPage;
EOL
