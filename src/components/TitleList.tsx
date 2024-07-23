// src/components/TitleList.tsx

import { useEffect, useState } from 'react';
import api from '@/src/lib/api';
import Link from 'next/link';

interface Post {
  id: number;
  title: {
    rendered: string;
  };
  slug: string;
}

interface TitleListProps {
  categoryId: number;
  categoryName: string;
}

const TitleList = ({ categoryId, categoryName }: TitleListProps) => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (categoryId) {
      const fetchPosts = async () => {
        try {
          const response = await api.get(`wp/v2/posts?categories=${categoryId}`);
          setPosts(response.data);
        } catch (error) {
          console.error(`Error fetching posts for category ${categoryId}:`, error);
        }
      };

      fetchPosts();
    }
  }, [categoryId]);

  return (
    <div className="w-1/6 p-4 bg-white text-black">
      <h2 className="text-lg font-semibold mb-4">{categoryName}</h2>
      <ul>
        {posts.length > 0 ? (
          posts.map(post => (
            <li key={post.id} className="mb-2">
              <Link href={`/papers/${post.id}`}>
                <span className="text-blue-500 hover:underline">{post.title.rendered}</span>
              </Link>
            </li>
          ))
        ) : (
          <li>No posts found for this category.</li>
        )}
      </ul>
    </div>
  );
};

export default TitleList;
