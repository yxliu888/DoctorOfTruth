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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // 使用本地化的日期格式
  };

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
    // alert(categoryName + ' ' + categoryId);
    // const { data } = await api.get(`wp/v2/posts?categories=${categoryId}`);
    // if (data.length > 0){
      router.push(`/searchresults?categoryId=${categoryId}`);
    // }
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
    <Navbar query={searchQuery} onQueryChange={handleQueryChange} handleSubmit={handleSubmit} />
      <main className="flex flex-1 items-center justify-center h-screen">
        {/* <CategoryNav onCategorySelect={categorySelect}/> */}
        <div className="w-2/4 p-4">
          {
            <div key={post?.id}>
              <div className="mt-8 mb-1 text-2xl font-semibold">{post?.title.rendered}</div>
              <div className="mt-1 mb-4 text-gray-500">{formatDate(post?.date) + ' by ' + post?.author_name}</div>
              <div dangerouslySetInnerHTML={{ __html: post?.content.rendered }} />
            </div>
          }
          <div className="border-t border-gray-400 mt-10"></div>
          <div className="flex items-center justify-left font-semibold mb-8 mt-4 text-2xl">
            <div>Leave a comment</div>
          </div>
          <div className="md:justify-between">
            <Comments key={post?.id} postId={post?.id} />
          </div>
        </div>
      </main>
    </div>
  );
}