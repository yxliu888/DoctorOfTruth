import { useEffect, useState } from 'react';
import api from '@/src/lib/api';
import { Comment } from './types';

interface CommentProps {
  postId: string;
  commentParent: string;
  updateComments: any;
  author?: string;
}
export default function AddComment({ postId, commentParent, updateComments, author }: CommentProps) {
  const [replyComment, setReplyComment] = useState('');

  const addComment = async (formData: FormData) => {
    const content = formData.get('content') as string;
    const post = postId; // formData.get('comment_post_ID') as string;
    const authorName = formData.get('authorName') as string;
    const authorEmail = formData.get('authorEmail') as string;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(authorEmail)) {
      alert('Invalid email format!');
      return;
    }
    const data = {
      content: content, // 评论内容
      post: post, // 所属文章ID
      parent: commentParent,
      author_name: authorName,
      author_email: authorEmail,
    }
    try {
      // await api.post(`wp/v2/comments`, data, {headers:{'Authorization': 'Bearer '}});
      const response = await api.post(`wp/v2/comments`, data);
      const status = response.status;
      if (status === 201){
        const comment : Comment = {
          id: response.data.id,
          author_name: response.data.author_name,
          content: response.data.content,
          parent: response.data.parent, // 父评论的 ID
          children: [],
          date: response.data.date,
        };
        setReplyComment('');
        updateComments(comment);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };
  return (
    <div className="mt-1 mb-1 font-semibold">
      <form action={addComment}>
        <div className="flex flex-col">
          {/* <div className="flex flex-wrap -mx-3 mb-1"> */}
          <div className="flex flex-wrap  mb-2 mt-2">
            <div className="w-full md:w-1/3 md:pr-3 mb-6 md:mb-0">
              <input className="appearance-none block w-full bg-gray-0 text-gray-700 border border-gray-400 rounded py-1 px-4 mb-3 leading-tight focus:outline-none focus:bg-white-500" 
              id="authorName" name="authorName" type="text" placeholder="Name" required={true}></input>
            </div>
            <div className="w-full md:w-2/3 mb-3 md:mb-0">
              <input className="appearance-none block w-full bg-gray-0 text-grey-darker border border-gray-400 rounded py-1 px-4 leading-tight focus:outline-none focus:bg-white-500 focus:border-gray-600" 
              id="authorEmail" name="authorEmail" type="text" placeholder="Email" required={true}></input>
            </div>
          </div>
              
          {/* </div> */}
          <textarea id="content" name="content"
            value={replyComment}  
            placeholder={author ? "Reply to " + author : "Comment"}
            onChange={(e) => setReplyComment(e.target.value)}
            className="appearance-none block w-90 text-gray-700 border border-gray-400 rounded py-3 px-4  mb-3 leading-tight focus:outline-none focus:bg-white-500"
            cols={45} rows={4} required={true}>
          </textarea>

          <div className="flex flex-row items-center justify-center">
            <button className="px-6 py-2 bg-blue-500 text-white rounded" type="submit">Ok</button>
            {/* <button className="px-6 py-2 bg-red-500 text-white rounded ml-4" onClick={cancelReplyBox}>取消</button> */}
          </div>
          {/* )} */}
          {/* <input type="hidden" name="comment_post_ID" value={postId} id="comment_post_ID" /> */}
        </div>
      </form>
    </div>
  );
}