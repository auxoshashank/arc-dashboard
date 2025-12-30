import { getServerSession } from "next-auth";
import { signOut, getSession } from "next-auth/react";
import { notFound, redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

function logoutOnUnauthorized() {
  const isServer = typeof window === "undefined";

  if (isServer) {
    redirect("/login");
  } else {
    signOut({ callbackUrl: "/login", redirect: true });
  }
}

export async function apiFetch(endpoint, options = {}) {
  try {
    let res = await fetch(endpoint, {
      ...options,
    });

    if (res.ok) return res.json();

    // --- 401 Handling ---
    if (res.status === 401) {
      const isServer = typeof window === "undefined";
      let session = null;
      let provider = null;
      let refreshToken = null;

      if (isServer) {
        session = await getServerSession(authOptions);
        provider = session?.provider || null;
        refreshToken = session?.refreshToken || null;
      } else {
        session = await getSession();
        provider = session?.provider || null;
        refreshToken = session?.refreshToken || null;
      }

      if (!provider || !refreshToken) {
        console.warn(
          "Either provider or refresh-token not available. Redirecting to login...",
        );
        logoutOnUnauthorized();
        return;
      }

      console.warn("Access token expired. Refreshing...");
      let refreshRes = null;

      if (isServer) {
        console.warn("Server-side refresh attempt");
        refreshRes = await fetch(
          `${process.env.NEXTAUTH_URL}/api/auth/refresh`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ provider, refreshToken }),
          },
        );
      } else {
        console.warn("Client-side refresh attempt");
        refreshRes = await fetch("/api/auth/refresh", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ provider, refreshToken }),
        });
      }

      if (!refreshRes?.ok) {
        console.error(
          "Failed to refresh access token:",
          refreshRes?.statusText,
        );
        logoutOnUnauthorized();
        return;
      }

      const resValue = await refreshRes.json();

      // Optional: update session in-memory for current request
      session.accessToken = resValue.access_token;
      session.refreshToken = resValue.refresh_token ?? refreshToken;

      options.headers = options.headers || {};

      if (options.headers?.Authorization) {
        options.headers.Authorization = `Bearer ${session.accessToken}`;
      }

      // Retry once with new token
      res = await fetch(endpoint, {
        ...options,
      });

      if (res.ok) return res.json();

      if (res.status === 401) {
        console.warn(
          `Api fetch failed again with 401 after refresh for ${endpoint}`,
        );
        logoutOnUnauthorized();
        return;
      }
    }

    if (res.status === 404) {
      notFound();
    }

    const errText = await res.text();
    throw new Error(`API error: ${res.status} ${res.statusText} - ${errText}`);
  } catch (error) {
    console.error("API Fetch Error:", endpoint, error);
    throw error;
  }
}

export const api = {
  get: (endpoint, headers) =>
    apiFetch(endpoint, {
      headers: {
        "Content-Type": "application/json",
        method: "GET",
        ...headers,
      },
    }),
  post: (endpoint, body, headers) =>
    apiFetch(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json", ...headers },
    }),
  put: (endpoint, body, headers) =>
    apiFetch(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json", ...headers },
    }),
  delete: (endpoint, headers) =>
    apiFetch(endpoint, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", ...headers },
    }),
};
