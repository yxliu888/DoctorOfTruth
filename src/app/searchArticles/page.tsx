'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/src/lib/api';
import Image from 'next/image';
import CategoryNav from '@/src/components/CategoryNav';
import TitleList from '@/src/components/TitleList';

interface Post {
  id: number;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
}

export default function SearchArticles() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const [results, setResults] = useState<Post[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('');

  const handleCategorySelect = (categoryId: number, categoryName: string) => {
    if (selectedCategoryId === categoryId) {
      setSelectedCategoryId(null);
      setSelectedCategoryName('');
    } else {
      setSelectedCategoryId(categoryId);
      setSelectedCategoryName(categoryName);
    }
  };

  useEffect(() => {
    if (query) {
      api.get(`wp/v2/posts?search=${query}`)
        .then(response => setResults(response.data))
        .catch(error => console.error('Error fetching search results:', error));
    }
  }, [query]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="w-full flex justify-between items-center p-4 bg-white shadow-md">
        <div className="flex items-center">
          <Image src="/images/logo.png" alt="Logo" width={50} height={50} />
          <h1 className="text-2xl font-bold ml-2">Doctor of Truth</h1>
        </div>
        <div className="flex-grow flex justify-center items-center">
          <form onSubmit={(e) => { e.preventDefault(); }} className="flex items-center bg-gray-100 shadow-md rounded-full overflow-hidden px-2">
            <input
              type="text"
              value={query}
              placeholder="Search..."
              className="flex-grow py-2 px-4 outline-none bg-transparent"
              readOnly
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
      <main className="flex flex-1">
        <CategoryNav onCategorySelect={handleCategorySelect} />
        <div className="flex-grow p-4">
          <h2 className="text-xl font-semibold mb-4">Search Results:</h2>
          {results.length > 0 ? (
            <ul className="list-disc pl-5">
              {results.map(result => (
                <li key={result.id} className="mb-4">
                  <Link href={`/papers/${result.id}`} className="text-blue-500 hover:underline">
                    {result.title.rendered}
                  </Link>
                  <p dangerouslySetInnerHTML={{ __html: result.excerpt.rendered }} />
                </li>
              ))}
            </ul>
          ) : (
            <p>No results found.</p>
          )}
        </div>
        {selectedCategoryId !== null && (
          <TitleList categoryId={selectedCategoryId} categoryName={selectedCategoryName} />
        )}
      </main>
    </div>
  );
}
