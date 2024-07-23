'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '@/src/lib/api';
import Comments from './comments';
import Image from 'next/image';
import CategoryNav from '@/src/components/CategoryNav';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/src/components/Navbar';

export default function PaperPage({params}: any) {
  const { id } = params;
  const [post, setPost] = useState<any | null>(null);
  // const [comments, setComments] = useState([]);
  // const [posts, setPosts] = useState([]);
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const categoryId = searchParams.get('categoryId') || '';
  const [searchQuery, setSearchQuery] = useState(query);


  const router = useRouter();

  useEffect(() => {
    fetchPost();
  }, []);
  
  const fetchPost = async () => {
    try {
      const { data } = await api.get(`wp/v2/posts/${id}`);

      const postData = data;
      // Fetch authors data for each post
      const authorPromise = async (post: any) => {
        const authorRes = await api.get(`wp/v2/users/${post.author}`);
        post.author_name = authorRes.data.name; // Assuming you want to display the author's name
        return post;
      };
      setPost(await authorPromise(data));
      // setPost(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const categorySelect = async (categoryId: number, categoryName: string) => {
    //alert(categoryName + ' ' + categoryId);
    const { data } = await api.get(`wp/v2/posts?categories=${categoryId}`);
    if (data.length > 0){
      router.push(`/searchresults?categoryId=${categoryId}`);
    }
  }
  const handleQueryChange = (query: string) => {
    setSearchQuery(query);
  };
  function handleSubmit(event: any) {
    event.preventDefault();
    // router.push(`/searchresults?query=${searchQuery}&categoryId=${categoryId}`);
    router.push(`/searchresults?query=${searchQuery}`);
  }
  return (
    <div className="min-h-screen flex flex-col bg-white">
    {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> */}
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
      <main className="flex flex-1">
        <CategoryNav onCategorySelect={categorySelect}/>
        <div className="w-3/4 p-4">
          {
            <div key={post?.id}>
              <div className="mt-8 mb-1 text-2xl font-semibold">{post?.title.rendered}</div>
              <div className="mt-1 mb-4 text-gray-500">{post?.author_name + ' ' + post?.date}</div>
              <div dangerouslySetInnerHTML={{ __html: post?.content.rendered }} />
            </div>
          }
          <div className="border-t border-gray-400 mt-10"></div>
          <div className="flex items-center justify-center font-semibold mb-8">
            <div>评论</div>
          </div>
          <div className="md:justify-between">
            <Comments key={post?.id} postId={post?.id} />
          </div>
        </div>
      </main>
    </div>
  );
}