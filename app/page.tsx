import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600">
      <div className="text-center">
        <h1 className="text-4xl text-white font-bold mb-8 animate__animated animate__fadeIn">
          Welcome to the Admin Dashboard
        </h1>
        <Link href="/admin">
          <button className="px-8 py-4 bg-yellow-500 text-white font-semibold rounded-lg shadow-lg transform transition-all hover:scale-110 hover:bg-yellow-400 animate__animated animate__pulse">
            Go to Dashboard of Nike Shirts and Shoes
          </button>
        </Link>
      </div>
    </div>
  );
}
