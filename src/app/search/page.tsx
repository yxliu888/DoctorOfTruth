'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(`/searchResult?query=${query}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="w-full flex justify-between items-center p-4 bg-white shadow-md">
        <div className="flex items-center">
          <Image src="/images/logo.png" alt="Logo" width={50} height={50} />
          <h1 className="text-2xl font-bold ml-2">Doctor of Truth</h1>
        </div>
        <div className="flex-grow flex justify-center items-center">
          <form onSubmit={handleSearch} className="flex items-center bg-gray-100 shadow-md rounded-full overflow-hidden px-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="flex-grow py-2 px-4 outline-none bg-transparent"
            />
            <button type="submit" className="text-gray-500 px-2">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.9 14.32a8 8 0 111.414-1.414l4.384 4.383a1 1 0 01-1.414 1.415l-4.384-4.383zM10 16a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
              </svg>
            </button>
          </form>
        </div>
        <div className="flex items-center space-x-4">
          <a href="http://54.91.90.2/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Join the Community
          </a>
        </div>
      </header>
      <main className="flex flex-col items-center mt-8">
        {/* 这里可以添加其他内容 */}
      </main>
    </div>
  );
}
