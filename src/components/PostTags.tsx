// src/components/PostTags.tsx

import { useEffect, useState } from 'react';
import api from '@/src/lib/api';
import Link from 'next/link';

interface Tag {
  id: number;
  name: string;
  slug: string;
}

interface PostTagsProps {
  postId: number;
}

const PostTags = ({ postId }: PostTagsProps) => {
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await api.get(`wp/v2/tags?post=${postId}`);
        setTags(response.data);
      } catch (error) {
        console.error(`Error fetching tags for post ${postId}:`, error);
      }
    };

    fetchTags();
  }, [postId]);

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold">Tags:</h3>
      {tags.length > 0 ? (
        <ul className="flex flex-wrap">
          {tags.map(tag => (
            <li key={tag.id} className="mr-2 mb-2">
              <Link href={`/tag/${tag.slug}`} className="text-blue-500 hover:underline">
                {tag.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default PostTags;
