const express = require("express");
const { WorkOS } = require("@workos-inc/node");

const app = express();
require("dotenv").config();
const PORT = process.env.port || 5001;
const workos = new WorkOS(process.env.WORKOS_API_KEY);
const clientId = process.env.WORKOS_CLIENT_ID;

app.get("/auth", (_req, res) => {
  const authorizationUrl = workos.userManagement.getAuthorizationUrl({
    // Specify that we'd like AuthKit to handle the authentication flow
    provider: "authkit",

    // The callback endpoint that WorkOS will redirect to after a user authenticates
    redirectUri: "http://localhost:5001/callback",
    clientId,
  });

  // Redirect the user to the AuthKit sign-in page
  res.redirect(authorizationUrl);
});

app.get("/callback", async (req, res) => {
  // The authorization code returned by AuthKit
  const code = req.query.code;

  const { user } = await workos.userManagement.authenticateWithCode({
    code,
    clientId,
  });

  // Use the information in `user` for further business logic.

  // Redirect the user to the homepage
  res.redirect("/");
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
