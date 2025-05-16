"use client";
import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <h1 className="text-3xl font-bold text-brand-green mb-6">Sign In to Clifford Classroom</h1>
      <button
        onClick={() => signIn("google")}
        className="bg-brand-green hover:bg-brand-green-dark text-white font-bold py-2 px-6 rounded shadow-md transition-colors"
      >
        Sign in with Google
      </button>
    </div>
  );
} 