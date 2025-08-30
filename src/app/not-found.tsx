import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-black mb-4">Page Not Found</h2>
        <p className="text-black mb-4">Could not find the requested page.</p>
        <Link href="/" className="text-blue-600 hover:text-blue-800">
          Return Home
        </Link>
      </div>
    </div>
  );
}
