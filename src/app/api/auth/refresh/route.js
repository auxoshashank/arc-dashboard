import { NextResponse } from "next/server";
import { fetchTokensFromRefreshFlow } from "@/lib/providers";

export async function POST(req) {
  const body = await req.json();
  const provider = body.provider;
  const refreshToken = body.refreshToken;
  const scope = body.scope;

  if (!provider) {
    return NextResponse.json(
      { error: "Missing auth provider" },
      { status: 400 },
    );
  }

  if (!refreshToken) {
    return NextResponse.json(
      { error: "Missing refresh token" },
      { status: 400 },
    );
  }

  try {
    const tokensInfo = await fetchTokensFromRefreshFlow(
      provider,
      refreshToken,
      scope,
    );

    if (!tokensInfo) {
      return NextResponse.json(
        { error: "Token refresh failed" },
        { status: 500 },
      );
    }

    return NextResponse.json(tokensInfo);
  } catch (err) {
    console.error("Unexpected error refreshing token:", err);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 },
    );
  }
}
