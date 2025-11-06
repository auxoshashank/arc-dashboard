import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import CognitoProvider from "next-auth/providers/cognito";
import {
  fetchTokensFromRefreshFlow,
  fetchAzureUserProfilePhoto,
  fetchCognitoUserInfo,
} from "@/lib/providers";

const configureAuthProviders = () => {
  const providers = [];
  const adminEmails = process.env.ADMIN_EMAIL_ADDRESS?.split(",").map((email) =>
    email.toLowerCase().trim(),
  );

  if (process.env.AZURE_AD_CLIENT_ID) {
    console.log("Configuring Azure AD Provider");

    providers.push(
      AzureADProvider({
        clientId: process.env.AZURE_AD_CLIENT_ID,
        clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
        tenantId: process.env.AZURE_AD_TENANT_ID,
        authorization: {
          params: {
            scope: `api://${process.env.AZURE_AD_CLIENT_ID}/Damia.Access openid profile email offline_access User.Read Sites.Read.All Files.Read.All`,
            response_type: "code",
          },
        },
        checks: ["pkce", "state"],
        async profile(profile) {
          return {
            ...profile,
            id: profile.sub,
            isAdmin:
              adminEmails?.includes(profile.email?.toLowerCase()) ||
              adminEmails?.includes(profile.preferred_username?.toLowerCase()),
          };
        },
      }),
    );
  }

  if (process.env.COGNITO_CLIENT_ID) {
    console.log("Configuring Cognito Provider");

    providers.push(
      CognitoProvider({
        clientId: process.env.COGNITO_CLIENT_ID,
        clientSecret: process.env.COGNITO_CLIENT_SECRET,
        issuer: `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`,
        authorization: {
          params: {
            scope: `email openid profile`,
            response_type: "code",
          },
        },
        checks: ["pkce", "state"],
        async profile(profile) {
          return {
            profile,
            id: profile.sub,
            name: profile.name ?? profile.username,
            email: profile.email,
            isAdmin:
              adminEmails?.includes(profile.email?.toLowerCase()) ||
              adminEmails?.includes(profile.preferred_username?.toLowerCase()),
          };
        },
      }),
    );
  }

  return providers;
};

async function checkRefreshTokens(token) {
  if (
    !token.refreshToken ||
    !token.expiresAt ||
    Date.now() / 1000 <= token.expiresAt - 300 // Refresh 5 minutes before expiry
  ) {
    return;
  }

  let tokensInfo = null;
  console.log("[Check refresh] Token is expired, refreshing...");
  tokensInfo = await fetchTokensFromRefreshFlow(
    token.provider,
    token.refreshToken,
  );

  if (tokensInfo) {
    token.accessToken = tokensInfo.accessToken;
    token.refreshToken = tokensInfo.refreshToken;
    token.expiresAt = tokensInfo.expiresAt;
  }
}

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: configureAuthProviders(),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account }) {
      // account comes only for the first time on signin
      if (account) {
        if (account.access_token) {
          token.accessToken = account.access_token;
        }

        if (account.refresh_token) {
          token.refreshToken = account.refresh_token;
        }

        if (account.provider) {
          token.provider = account.provider;
        }

        if (account.expires_at) {
          token.expiresAt = account.expires_at;
        } else if (account.ext_expires_in) {
          token.expiresAt =
            Math.floor(Date.now() / 1000) + account.ext_expires_in;
        }

        if (account.id_token) {
          const idTokenClaims = JSON.parse(
            Buffer.from(account.id_token.split(".")[1], "base64").toString(
              "utf-8",
            ),
          );

          token.roles = idTokenClaims?.roles ?? [];
        }
      }

      await checkRefreshTokens(token);
      return token;
    },
    async session({ session, token }) {
      await checkRefreshTokens(token);

      session.accessToken = token?.accessToken;
      session.refreshToken = token?.refreshToken;
      session.provider = token?.provider;
      session.user.roles = token?.roles ?? [];

      if (!session?.user?.image && session.refreshToken) {
        if (session.provider === "azure-ad") {
          session.user.image = await fetchAzureUserProfilePhoto(
            session.refreshToken,
          );
        } else if (session.provider === "cognito") {
          const userInfo = await fetchCognitoUserInfo(session.accessToken);
          session.user.image = userInfo?.picture || null;
        }
      }

      console.debug("[Session Callback] session info:", session);
      return session;
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/chat`; // Always redirect to homepage after sign-in
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
