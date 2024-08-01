// src/app/page.tsx

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  function handleSubmit(event: any) {
    event.preventDefault();
    router.push(`/searchresults?query=${searchQuery}`);
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4 bg-gray-100">

      <div className="absolute top-4 right-4">
        <Link href="https://www.spiritai.net/login" passHref>
          <button className="bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Join the Community
          </button>
        </Link>
      </div>

      <div className="flex items-center mb-8 space-x-4">
        <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48">
          <Image src="/images/logo.png" alt="Logo" width={1920} height={1920} layout="responsive" className="rounded-full" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold" style={{ textShadow: '6px 6px 12px rgba(0, 0, 0, 0.2)' }}>
          Doctor of Truth
        </h1>
      </div>

      <div className="mb-8 w-full max-w-md px-4">
        <div 
          className="relative"
          onClick={() => {
            const inputElement = document.getElementById('search-input');
            if (inputElement) {
              inputElement.focus();
            }
          }}
        >
          <form onSubmit={handleSubmit}>
            <input 
              id="search-input"
              type="text" 
              placeholder="Seek Knowledge of The Truth" 
              className={`w-full border border-gray-300 rounded-md py-2 px-4 pl-10 focus:outline-none ${isFocused ? 'focus:border-blue-400' : ''}`}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {/* <div className="absolute left-0 top-0 flex items-center h-full pl-3"> */}
            <button type="submit" className="absolute left-0 top-0 flex items-center h-full pl-3">
              <svg className="h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.9 14.32a8 8 0 111.414-1.414l4.384 4.383a1 1 0 01-1.414 1.415l-4.384-4.383zM10 16a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
              </svg>
            </button>
            {/* </div> */}
          </form>
        </div>
      </div>

    </main>
  );
}
