'use client';
import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/src/lib/api';
import Image from 'next/image';
import CategoryNav from '@/src/components/CategoryNav';
import Navbar from '@/src/components/Navbar';

export interface Post {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  author: number;
  author_name?: string; // Optional, to store author's name
  date: string;
  featured_media: number;
  jetpack_featured_media_url: string;
}

export default function SearchResult() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const categoryId = searchParams.get('categoryId') || '';
  const [searchQuery, setSearchQuery] = useState(query);

  const [posts, setPosts] = useState<Post[]>([]);
  const initialized = useRef(false);
  useEffect(() => {
    if (! initialized.current){
      initialized.current = true;
      searchPosts(searchQuery, categoryId);
    }
  }, []);
  const searchPosts = async (searchQuery: string, categoryId: string) => {
    try {
      let postsRes: any;
      if (categoryId == ''){
        postsRes = await api.get(`wp/v2/posts?search=${searchQuery}`);
      } else {
        postsRes = await api.get(`wp/v2/posts?search=${searchQuery}&categories=${categoryId}`);
      }
      const postsData = postsRes.data;
      // Fetch authors data for each post
      const authorPromises = postsData.map(async (post: Post) => {
        const authorRes = await api.get(`wp/v2/users/${post.author}`);
        post.author_name = authorRes.data.name; // Assuming you want to display the author's name
        return post;
      });
      setPosts(await Promise.all(authorPromises));
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };
  const handleQueryChange = (query: string) => {
    setSearchQuery(query);
    //router.push(`/searchresults`);
  };
  function handleSubmit(event: any) {
    event.preventDefault();
    searchPosts(searchQuery, '');
  }
  const categorySelect = async (categoryId: number, categoryName: string) => {
    searchPosts(searchQuery, '' + categoryId);
  }
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar query={searchQuery} onQueryChange={handleQueryChange} handleSubmit={handleSubmit} />
      {/* <header className="w-full flex justify-between items-center p-4 bg-white shadow-md">
        <div className="flex items-center">
          <Image src="/images/logo.png" alt="Logo" width={50} height={50} />
          <h1 className="text-2xl font-bold ml-2">Doctor of Truth</h1>
        </div>
        <div className="flex-grow flex justify-center items-center">
          <form onSubmit={handleSubmit}  className="flex items-center bg-gray-100 shadow-md rounded-full overflow-hidden px-2">
            <input
              type="text"
              value={searchQuery}
              placeholder="Search..."
              onChange={(e) => setSearchQuery(e.target.value)}
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
      </header> */}
      {/* <main className="flex flex-col items-center mt-8"> */}
      <main className="flex flex-1 bg-white">
        <CategoryNav onCategorySelect={categorySelect}/>
        <div className="w-full max-w-4xl">
          <h2 className="text-xl font-semibold mb-4">Search Results:</h2>
          {posts.length > 0 ? (
            <ul className="list-disc pl-5">
              {posts.map(post => (
                 <Link key={post.id} href={`/papers/${post.id}`} passHref>
                  <div className='w-full lg:flex lg:mx-2 md:mx-2'>
                   {post.featured_media ? (
                     <div className="aspect-w-10 aspect-h-6">
                       <Image
                         src={post.jetpack_featured_media_url}
                         alt={post.title.rendered}
                         className="object-cover object-center rounded"
                         width={100}
                         height={100}
                         quality={50}
                       />
                     </div>
                   ) : (
                    <div className="aspect-w-10 aspect-h-6">
                      <Image
                        src='/images/blank.jpg'
                        alt={post.title.rendered}
                        className="object-cover object-center rounded"
                        width={100}
                        height={100}
                        quality={50}
                      />
                    </div>
                   )}
                   <div>
                    <h2 className="text-1xl font-bold text-gray-900 group-hover:text-blue-600">{post.title.rendered}</h2>
                    <p>{ post.author_name }</p>
                    <p>{post.date}</p>
                   </div>
                
                  </div>
               </Link>
              ))}
            </ul>
          ) : (
            <p>No results found.</p>
          )}
        </div>
      </main>
    </div>
  );
}
