globalThis.authProviders = globalThis.authProviders || {};

async function getAuthProviders() {
  const AzureProviderEnvConfig = {
    clientId: process.env.AZURE_AD_CLIENT_ID,
    clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
    tenantId: process.env.AZURE_AD_TENANT_ID,
  };

  const CognitoProviderEnvConfig = {
    clientId: process.env.COGNITO_CLIENT_ID,
    clientSecret: process.env.COGNITO_CLIENT_SECRET,
    issuer: `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`,
    region: process.env.COGNITO_REGION,
    userpoolId: process.env.COGNITO_USER_POOL_ID,
    domainPrefix: process.env.COGNITO_DOMAIN_PREFIX,
  };

  // Helper function to check if all values in a config object are defined
  const isConfigComplete = (config) => {
    return Object.values(config).every(
      (value) => value !== undefined && value !== null && value !== "",
    );
  };

  // Check if Azure config is complete
  const isAzureConfigComplete = isConfigComplete(AzureProviderEnvConfig);

  // Check if Cognito config is complete
  const isCognitoConfigComplete = isConfigComplete(CognitoProviderEnvConfig);

  // Ensure at least one complete configuration exists
  if (!isAzureConfigComplete && !isCognitoConfigComplete) {
    return NextResponse.json(
      {
        error: "No valid authentication provider configuration found",
        details:
          "At least one complete provider configuration must be set. " +
          "Please ensure all required environment variables are provided for either Azure AD or Cognito:\n" +
          "Azure AD: AZURE_AD_CLIENT_ID, AZURE_AD_CLIENT_SECRET, AZURE_AD_TENANT_ID\n" +
          "Cognito: COGNITO_CLIENT_ID, COGNITO_CLIENT_SECRET, COGNITO_ISSUER",
      },
      {
        status: 500,
      },
    );
  }

  // Provider environment configurations
  const authProviders = {};

  if (isAzureConfigComplete) {
    authProviders["azure-ad"] = {
      config: AzureProviderEnvConfig,
      scopes: `api://${AzureProviderEnvConfig.clientId}/Damia.Access openid profile email offline_access User.Read Sites.Read.All Files.Read.All`,
    };
  }

  if (isCognitoConfigComplete) {
    authProviders["cognito"] = {
      config: CognitoProviderEnvConfig,
      scopes: `email openid profile`,
    };
  }

  globalThis.authProviders = authProviders;
  return authProviders;
}

async function fetchTokensFromRefreshFlow(
  provider,
  refreshToken,
  authScope = null,
) {
  if (!provider || !refreshToken) {
    throw new Error(
      "Provider and refresh token are required for refresh flow.",
    );
  }

  const authProviders = await getAuthProviders();
  const authProvider = authProviders[provider];

  if (!authProvider) {
    throw new Error(
      `Auth provider for ${provider} is not configured! Cannot run refresh-token flow.`,
    );
  }

  console.log(
    `[RefreshAccessToken] Starting ${provider} refresh flow with token:`,
  );

  try {
    let refreshUrl = null;
    let urlParams = null;

    if (provider == "azure-ad") {
      refreshUrl = `https://login.microsoftonline.com/${authProvider.config.tenantId}/oauth2/v2.0/token`;
      urlParams = new URLSearchParams({
        client_id: authProvider.config.clientId,
        client_secret: authProvider.config.clientSecret,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        scope: authScope || authProvider.scopes,
      });
    } else if (provider == "cognito") {
      refreshUrl = `${authProvider.config.issuer}/oauth2/token`;
      urlParams = new URLSearchParams({
        client_id: authProvider.config.clientId,
        client_secret: authProvider.config.clientSecret,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        scope: authProvider.scopes,
      });
    }

    if (!refreshUrl || !urlParams) {
      throw new Error(`Unsupported auth provider: ${provider}`);
    }

    const response = await fetch(refreshUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: urlParams,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to refresh tokens for ${provider}: ${response.status}`,
      );
    }

    const refreshed = await response.json();

    if (refreshed?.access_token) {
      console.log(
        `[RefreshAccessToken] Successfully refreshed access token for ${provider}`,
      );

      return {
        accessToken: refreshed.access_token,
        refreshToken: refreshed?.refresh_token || refreshToken,
        expiresAt: Math.floor(Date.now() / 1000) + Number(refreshed.expires_in),
      };
    } else {
      console.error(
        `[RefreshAccessToken] Failed to refresh access token for ${provider}:`,
        refreshed,
      );
    }
  } catch (error) {
    console.error(
      `[RefreshAccessToken] Error during ${provider} refresh flow:`,
      error,
    );
  }

  return null;
}

async function fetchAzureUserProfilePhoto(refreshToken) {
  const tokensInfo = await fetchTokensFromRefreshFlow(
    "azure-ad",
    refreshToken,
    "https://graph.microsoft.com/.default",
  );

  if (!tokensInfo) {
    console.error(
      "[Session Callback] Failed to fetch azure-ad tokens from graph-api scope",
    );

    return null;
  }

  const photoRes = await fetch(
    "https://graph.microsoft.com/v1.0/me/photo/$value",
    {
      headers: {
        Authorization: `Bearer ${tokensInfo.accessToken}`,
      },
    },
  );

  if (photoRes.ok) {
    const imageBuffer = await photoRes.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString("base64");

    return `data:image/jpeg;base64,${base64Image}`;
  }

  console.error(
    "[Session Callback] Failed to fetch user photo:",
    photoRes.statusText,
  );

  return null;
}

async function fetchCognitoUserInfo(accessToken) {
  const authProviders = await getAuthProviders();
  const authProvider = authProviders["cognito"];

  if (!authProvider) {
    throw new Error(
      "Auth provider for cognito is not configured! Cannot fetch user info.",
    );
  }

  console.log("[FetchAWSUserProfilePhoto] Fetching user info from AWS Cognito");
  const photoRes = await fetch(
    `https://${authProvider.config.domainPrefix}.auth.${authProvider.config.region}.amazoncognito.com/oauth2/userInfo`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (photoRes.ok) {
    const userInfo = await photoRes.json();
    return userInfo;
  }

  console.error(
    "[Session Callback] Failed to fetch AWS user info:",
    photoRes.statusText,
  );

  return null;
}

export {
  getAuthProviders,
  fetchTokensFromRefreshFlow,
  fetchAzureUserProfilePhoto,
  fetchCognitoUserInfo,
};
