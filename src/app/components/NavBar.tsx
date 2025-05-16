"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function NavBar() {
  const { data: session, status } = useSession();
  return (
    <nav className="bg-brand-green text-white py-4 px-6">
      <div className="max-w-6xl mx-auto flex justify-between items-center font-average">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white hover:text-brand-green-light transition">
          <img src="/cliffordclassroomlogofinal.png" alt="Clifford Classroom Logo" style={{ height: 40, width: 'auto' }} className="mr-2 rounded" />
          CliffordClassroom
        </Link>
        <div className="flex gap-6 items-center">
          <Link href="/" className="hover:text-brand-green-light transition">Home</Link>
          <Link href="/tools" className="hover:text-brand-green-light transition">Tools</Link>
          <Link href="/about" className="hover:text-brand-green-light transition">About</Link>
          {status === "loading" ? null : session ? (
            <>
              <Link href="/my-lessons" className="hover:text-brand-green-light transition">My Lessons</Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="ml-2 bg-white text-brand-green font-semibold px-3 py-1 rounded hover:bg-brand-green-light transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/signin"
              className="ml-2 bg-white text-brand-green font-semibold px-3 py-1 rounded hover:bg-brand-green-light transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
} 