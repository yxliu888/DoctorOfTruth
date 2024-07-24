'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const initialized = useRef(false);
  useEffect(() => {
    if (! initialized.current){
      initialized.current = true;
      const queryParams = new URLSearchParams(window.location.search);
      const query = queryParams.get('query') || '';
      const categoryId = queryParams.get('categoryId') || '';
      setSearchQuery(query);
      searchPosts(query, categoryId);
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
  };
  function handleSubmit(event: any) {
    event.preventDefault();
    searchPosts(searchQuery, '');
    router.push(`/searchresults`);
  }
  const categorySelect = async (categoryId: number, categoryName: string) => {
    searchPosts('', '' + categoryId);
  }
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar query={searchQuery} onQueryChange={handleQueryChange} handleSubmit={handleSubmit} />
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
