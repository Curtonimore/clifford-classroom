import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function MyLessonsPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/signin");
  }
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 font-average">
      <h1 className="text-4xl font-bold text-darkgreen mb-4">My Lessons</h1>
      <p className="text-lg text-gray-700 mb-6">This is where your saved lesson plans will appear.</p>
      <div className="border rounded p-6 bg-white text-gray-600">Lesson saving coming soon!</div>
    </main>
  );
} 