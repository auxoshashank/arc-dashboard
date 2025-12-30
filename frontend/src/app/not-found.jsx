import Link from "next/link";

export default function Custom404() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="mt-2 text-gray-600">
        Oops! The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="mt-4 rounded-lg bg-blue-500 px-6 py-2 text-white"
      >
        Go Home
      </Link>
    </div>
  );
}
