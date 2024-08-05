import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { OAuth2Client } from "google-auth-library";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const gooleOauthRedirect = onRequest(async (request, response) => {
    const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_REDIRECT_URI
  );

  if(request?.query?.code){
    const code = request.query.code as string;
    const {tokens} = await client.getToken(code);
    const accessToken = tokens.access_token;
    const refreshToken = tokens.refresh_token;

    if(accessToken && refreshToken){
    
        console.log("Access Token: ", accessToken);
        console.log("Refresh Token: ", refreshToken);
        response.send("Success");
    }
  }


  logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});
