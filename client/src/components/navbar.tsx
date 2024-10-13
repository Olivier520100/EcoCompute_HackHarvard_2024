import { Github, Leaf } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-green-600 text-white p-3 flex justify-between items-center shadow-md">
      <div className="flex items-center space-x-4">
        <Leaf className="h-8 w-8 text-white ml-2" />
        <Link href="/" className="py-1 rounded">
          <h1 className="text-2xl font-bold text-white hover:text-green-900 transition-all duration-1000">
            EcoCompute
          </h1>
        </Link>
      </div>
      <div className="flex space-x-4">
        <Link
          href="/dashboard"
          className="hover:text-green-900 text-lg font-bold px-2 py-1 rounded transition-all duration-1000"
        >
          Dashboard
        </Link>
        <Link
          href="/computing"
          className="hover:text-green-900 text-lg font-bold px-2 py-1 rounded transition-all duration-1000"
        >
          Computing
        </Link>
        <Link
          href="/"
          className="hover:text-green-900 text-lg font-bold px-2 py-1 rounded transition-all duration-1000"
        >
          Home
        </Link>
        <Link
          href="/about"
          className="hover:text-green-900 text-lg font-bold px-2 py-1 rounded transition-all duration-1000"
        >
          About
        </Link>
        <Link
          href="https://github.com/Olivier520100/EcoCompute_HackHarvard_2024"
          className="hover:text-green-900 transition-all duration-1000"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github className="h-8 w-8" />
        </Link>
      </div>
    </header>
  );
}
