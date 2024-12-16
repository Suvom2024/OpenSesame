'use client'

import { Search, FileBox, LayoutGrid } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { usePathname } from 'next/navigation'

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-[#1B352C] min-h-screen flex flex-col">
      {/* Logo container with better centering */}
      <div className="pt-8 pb-10 px-4 flex justify-center">
        <Image
          src="/logo.svg"
          alt="OpenSesame"
          width={180}
          height={48}
          className="object-contain"
        />
      </div>

      {/* Navigation links */}
      <nav className="flex flex-col space-y-2 px-4">
        <Link
          href="/"
          className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-all duration-200 ${
            pathname === '/'
              ? 'text-white bg-white/10'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Search className="h-5 w-5" />
          <span className="text-sm font-medium">Course Search</span>
        </Link>

        <Link
          href="/bulk_inference"
          className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-all duration-200 ${
            pathname === '/bulk_inference'
              ? 'text-white bg-white/10'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <FileBox className="h-5 w-5" />
          <span className="text-sm font-medium">Bulk Inference</span>
        </Link>

        <Link
          href="/manage-courses"
          className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-all duration-200 ${
            pathname === '/manage-courses'
              ? 'text-white bg-white/10'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <LayoutGrid className="h-5 w-5" />
          <span className="text-sm font-medium">Manage Course</span>
        </Link>
      </nav>

      {/* Add slight gradient overlay for depth */}
      <div className="mt-auto h-32 bg-gradient-to-t from-[#152820] to-transparent" />
    </div>
  )
}