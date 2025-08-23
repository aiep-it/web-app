"use client";
import Link from "next/link";

export default function ActivePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white p-6">
      <main className="max-w-3xl w-full bg-white shadow-md rounded-2xl p-8 md:p-12 ring-1 ring-black/5">
        <div className="flex items-center gap-6">
          <div className="flex-shrink-0">
            {/* Hero-like shield/lock icon */}
            <div className="h-24 w-24 flex items-center justify-center rounded-lg bg-red-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="h-12 w-12 text-red-600"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M12 2l7 4v6c0 5-3.58 9.74-7 11-3.42-1.26-7-6-7-11V6l7-4z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M12 11v4"
                />
                <circle cx="12" cy="17" r="1" />
              </svg>
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Account not active</h1>
            <p className="mt-2 text-lg text-gray-600 max-w-xl">
              Your account is currently not active. If you believe this is a mistake, contact your administrator to activate your account.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
              >
                Go to Home
              </Link>

              <a
                href="/support"
                className="inline-flex items-center rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Contact Support
              </a>

              <button
                onClick={() => location.reload()}
                className="inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-200"
              >
                Retry
              </button>
            </div>

          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-sm text-gray-500">
          <p>
            Tip: If you just registered, please check your email for an activation link. If you have already activated your account, ensure that your account is in good standing.
          </p>
        </div>
      </main>
    </div>
  );
}
