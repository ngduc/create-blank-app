# google-oauth-express-react

Add Google OAuth using `google-auth-library` and `jsonwebtoken` to existing express and react webapp.

### Requirements
- express backend app
- react ui webapp using `@react-oauth/google`

### After installing

Make sure you have:
- Env variables: `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET` (from Google) and `JWT_SECRET`
- Review and edit `routeAuth.ts`
- Check and edit `ProtectedPage.tsx`
