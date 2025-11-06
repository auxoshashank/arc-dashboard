"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn, handleError } from "@/lib/utils";
import { signIn } from "next-auth/react";
import { Icons } from "@/components/Icons";
import Image from "next/image";
import { logos } from "@/assets/logos";

export default function LoginPage() {
  const [loadingAzure, setLoadingAzure] = useState(false);
  const [loadingAws, setLoadingAws] = useState(false);

  const isClient = typeof window !== "undefined";
  const LOGIN_PROVIDERS = isClient
    ? process.env.NEXT_PUBLIC_DAMIA_LOGIN_PROVIDERS
    : process.env.DAMIA_LOGIN_PROVIDERS;

  const allowedProviders = (LOGIN_PROVIDERS || "")
    .split(";")
    .map((p) => p.trim().toLowerCase());

  const handleLogin = (e) => {
    e.preventDefault();
  };

  const handleAzureEntraIdLogin = async () => {
    setLoadingAzure(true);
    try {
      await signIn("azure-ad");
    } catch (err) {
      handleError("Failed to login user", err);
      setLoadingAzure(false);
    }
  };

  const handleAWSCognitoLogin = async () => {
    setLoadingAws(true);
    try {
      await signIn("cognito");
    } catch (err) {
      handleError("Failed to login user", err);
      setLoadingAws(false);
    }
  };

  const disableLoginButton = loadingAzure || loadingAws;

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-96 rounded-lg bg-white p-8 shadow-md">
        <div className="flex flex-col items-center">
          {/* Logo */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold text-white">
            <Icons.damiaLogo alt="Damia Logo" width={43} height={48} />
          </div>
          <h2
            className={cn(
              "text-center font-sans text-[48px] leading-[130%] font-bold text-[var(--inputs-select-text-text-dark,#19213D)]"
            )}
          >
            Damia
          </h2>
        </div>

        {/* Login Form */}
        <form className="mt-4 space-y-4" onSubmit={handleLogin}>
          {allowedProviders.includes("azure-ad") && (
            <Button
              onClick={handleAzureEntraIdLogin}
              variant="primary"
              className="border-primary flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-lg border bg-white px-4 py-3 font-medium text-gray-700 shadow-sm transition hover:bg-gray-100"
              disabled={disableLoginButton}
            >
              <Image
                src={logos.microsoftLogo?.src}
                alt="Microsoft Logo"
                height={24}
                width={24}
                className="h-6 w-6 object-contain object-left"
              />{" "}
              {loadingAzure ? "Logging in..." : "Login with Azure Entra-ID"}
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}
