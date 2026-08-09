import type { SocialProvider } from "@/lib/types/services";

type ProviderConfig = {
  clientId: string;
  clientSecret: string;
  authorizeUrl: string;
  tokenUrl: string;
  userInfoUrl?: string;
  scopes: string[];
};

type ProviderProfile = {
  id: string;
  email?: string;
  name?: string;
};

const PROVIDER_CONFIG: Record<SocialProvider, ProviderConfig> = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID ?? "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    userInfoUrl: "https://openidconnect.googleapis.com/v1/userinfo",
    scopes: ["openid", "email", "profile"],
  },
  facebook: {
    clientId: process.env.FACEBOOK_CLIENT_ID ?? "",
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? "",
    authorizeUrl: "https://www.facebook.com/v20.0/dialog/oauth",
    tokenUrl: "https://graph.facebook.com/v20.0/oauth/access_token",
    userInfoUrl: "https://graph.facebook.com/me?fields=id,name,email",
    scopes: ["email", "public_profile"],
  },
  line: {
    clientId: process.env.LINE_CLIENT_ID ?? "",
    clientSecret: process.env.LINE_CLIENT_SECRET ?? "",
    authorizeUrl: "https://access.line.me/oauth2/v2.1/authorize",
    tokenUrl: "https://api.line.me/oauth2/v2.1/token",
    userInfoUrl: "https://api.line.me/oauth2/v2.1/userinfo",
    scopes: ["openid", "profile", "email"],
  },
  apple: {
    clientId: process.env.APPLE_CLIENT_ID ?? "",
    clientSecret: process.env.APPLE_CLIENT_SECRET ?? "",
    authorizeUrl: "https://appleid.apple.com/auth/authorize",
    tokenUrl: "https://appleid.apple.com/auth/token",
    scopes: ["name", "email"],
  },
};

function ensureProviderConfigured(provider: SocialProvider): ProviderConfig {
  const config = PROVIDER_CONFIG[provider];

  if (!config.clientId || !config.clientSecret) {
    if (process.env.NODE_ENV === "test") {
      return {
        ...config,
        clientId: config.clientId || `${provider}-test-client-id`,
        clientSecret: config.clientSecret || `${provider}-test-client-secret`,
      };
    }

    throw new Error(`${provider} oauth config is missing`);
  }

  return config;
}

export function getOAuthRedirectUri(provider: SocialProvider): string {
  const baseUrl = process.env.AUTH_BASE_URL ?? "http://localhost:3000";
  return `${baseUrl}/api/auth/social/callback/${provider}`;
}

export function buildAuthorizationUrl(provider: SocialProvider, state: string): string {
  const config = ensureProviderConfigured(provider);
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: getOAuthRedirectUri(provider),
    response_type: "code",
    scope: config.scopes.join(" "),
    state,
  });

  if (provider === "apple") {
    params.set("response_mode", "query");
  }

  return `${config.authorizeUrl}?${params.toString()}`;
}

async function fetchToken(provider: SocialProvider, code: string): Promise<Record<string, unknown>> {
  const config = ensureProviderConfigured(provider);

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: getOAuthRedirectUri(provider),
    client_id: config.clientId,
    client_secret: config.clientSecret,
  });

  const response = await fetch(config.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error(`OAuth token exchange failed: ${provider}`);
  }

  return (await response.json()) as Record<string, unknown>;
}

function decodeJwtPayload(token: string): Record<string, unknown> {
  const parts = token.split(".");

  if (parts.length < 2) {
    throw new Error("Invalid JWT token format");
  }

  const payload = parts[1];
  const decoded = Buffer.from(payload, "base64url").toString("utf-8");
  return JSON.parse(decoded) as Record<string, unknown>;
}

export async function exchangeCodeForProfile(
  provider: SocialProvider,
  code: string
): Promise<ProviderProfile> {
  const config = ensureProviderConfigured(provider);
  const tokenPayload = await fetchToken(provider, code);
  const accessToken = String(tokenPayload.access_token ?? "");

  if (provider === "apple") {
    const idToken = String(tokenPayload.id_token ?? "");

    if (!idToken) {
      throw new Error("Apple id_token is missing");
    }

    const claims = decodeJwtPayload(idToken);

    return {
      id: String(claims.sub ?? ""),
      email: typeof claims.email === "string" ? claims.email : undefined,
      name: typeof claims.name === "string" ? claims.name : undefined,
    };
  }

  if (!config.userInfoUrl || !accessToken) {
    throw new Error("Missing user info endpoint or access token");
  }

  const response = await fetch(config.userInfoUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`OAuth user profile fetch failed: ${provider}`);
  }

  const profile = (await response.json()) as Record<string, unknown>;

  if (provider === "google") {
    return {
      id: String(profile.sub ?? ""),
      email: typeof profile.email === "string" ? profile.email : undefined,
      name: typeof profile.name === "string" ? profile.name : undefined,
    };
  }

  if (provider === "line") {
    return {
      id: String(profile.sub ?? profile.userId ?? ""),
      email: typeof profile.email === "string" ? profile.email : undefined,
      name: typeof profile.name === "string" ? profile.name : typeof profile.displayName === "string" ? profile.displayName : undefined,
    };
  }

  return {
    id: String(profile.id ?? ""),
    email: typeof profile.email === "string" ? profile.email : undefined,
    name: typeof profile.name === "string" ? profile.name : undefined,
  };
}
