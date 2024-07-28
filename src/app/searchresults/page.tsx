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
  const [searchCategoryId, setSearchCategoryId] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  //const [pageNumbers, setPageNumbers] = useState([]);
  const initialized = useRef(false);
  const [page, setPage] = useState(1);
  useEffect(() => {
    if (! initialized.current){
      initialized.current = true;
      const queryParams = new URLSearchParams(window.location.search);
      const query = queryParams.get('query') || '';
      const categoryId = queryParams.get('categoryId') || '';
      setSearchQuery(query);
      setSearchCategoryId(categoryId);
      searchPosts(query, categoryId, 1);
    }
  }, []);
  const searchPosts = async (searchQuery: string, categoryId: string, newPage: number) => {
    try {
      let postsRes: any;
      if (categoryId == ''){
        postsRes = await api.get(`wp/v2/posts?page=${newPage}&per_page=10&search=${searchQuery}`);
      } else {
        postsRes = await api.get(`wp/v2/posts?page=${newPage}&per_page=10&search=${searchQuery}&categories=${categoryId}`);
      }
      const postsData = postsRes.data;

      const tPages = parseInt(postsRes.headers['x-wp-totalpages'], 10);
      setTotalPages(tPages);
      // const pNumbers: number[] = [];
      // for (let i: number = 1; i <= totalPages; i++) {
      //   pNumbers.push(i);
      // }
      //setPageNumbers(pNumbers);
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
    setSearchCategoryId('');
  };
  function handleSubmit(event: any) {
    event.preventDefault();
    searchPosts(searchQuery, '', 1);
    router.push(`/searchresults`);
  }
  const categorySelect = async (categoryId: number, categoryName: string) => {
    setSearchQuery('');
    setSearchCategoryId('' + categoryId);
    searchPosts('', '' + categoryId, 1);
  }

  const handlePageChange = async (newPage: number) => {
    setPage(newPage);
    searchPosts(searchQuery, searchCategoryId, newPage);
  };
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar query={searchQuery} onQueryChange={handleQueryChange} handleSubmit={handleSubmit} />
      <main className="flex flex-1 bg-#f8fafc">
        <CategoryNav onCategorySelect={categorySelect}/>
        <div className="w-full max-w-4xl p-6 ">
          <h1 className="text-4xl font-semibold mb-4">Search Results:</h1>
          {posts.length > 0 ? (
            <ul className="list-disc pl-5 ">
              {posts.map(post => (
                 <Link key={post.id} href={`/papers/${post.id}`} passHref>
                  <div className='w-full lg:flex lg:mx-2 md:mx-2 h-22'>
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
                    <div className='ml-4'>
                      <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 h-8">{post.title.rendered}</h2>
                        <div className='flex flex-col justify-end h-12 text-right'>
                          <p>{ post.author_name }</p>
                          <p>{ post.date }</p>
                        </div>
                    </div>
                  </div>
               </Link>
              ))}
                <div>
                  {page > 1 && (
                    <button onClick={() => handlePageChange(page - 1)}>Previous</button>
                  )}
                  
                  {( page < totalPages) && (
                    <button onClick={() => handlePageChange(page + 1)}>Next</button>
                  )}
                  {totalPages > 1 && (
                    <nav>
                      <ul className="flex flex-wrap list-none p-0 justify-center items-center">
                        {(() => {
                          const items = [];
                          for (let i = 1; i <= totalPages; i++) {
                            items.push(
                              <li key={i} className={`mx-1 ${i === page ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'} border border-blue-500 rounded`}>
                                <button onClick={() => handlePageChange(i)} className="block px-2 py-0 text-center">{i}</button>
                              </li>
                            );
                          }
                          return items;
                        })()}
                      </ul>
                    </nav>
                )}
                </div>
            </ul>

          ) : (
            <p className='text-xl p-2'>No results found.</p>
          )}
        </div>
      </main>
    </div>
  );
}
