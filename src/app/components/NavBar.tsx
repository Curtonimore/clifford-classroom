import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="bg-darkgreen text-white py-4 px-6">
      <div className="max-w-6xl mx-auto flex justify-between items-center font-average">
        <Link href="/" className="text-xl font-bold text-white hover:text-gray-300 transition">CliffordClassroom</Link>
        <div className="flex gap-6">
          <Link href="/" className="hover:text-gray-300 transition">Home</Link>
          <Link href="/tools" className="hover:text-gray-300 transition">Tools</Link>
          <Link href="/about" className="hover:text-gray-300 transition">About</Link>
        </div>
      </div>
    </nav>
  );
} 