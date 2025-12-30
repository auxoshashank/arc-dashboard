"use client";

import Link from "next/link";

export default function CustomError() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center text-center">
      <p className="mt-2 text-gray-600">Something went wrong on our end.</p>
      <Link
        href="/"
        className="mt-4 rounded-lg bg-red-500 px-6 py-2 text-white"
      >
        Return Home
      </Link>
    </div>
  );
}
