import { useEffect, useState } from 'react';
import api from '@/src/lib/api';
import { Comment } from './types';

interface CommentProps {
  postId: string;
  commentParent: string;
  updateComments: any;
  cancelReplyBox?: any;
}
export default function AddComment({ postId, commentParent, updateComments, cancelReplyBox }: CommentProps) {
  const [replyComment, setReplyComment] = useState('');

  const addComment = async (formData: FormData) => {
    const content = formData.get('content') as string;
    const post = postId; // formData.get('comment_post_ID') as string;
    const authorName = formData.get('authorName') as string;
    const authorEmail = formData.get('authorEmail') as string;
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
    <div className="mt-1 mb-4 font-semibold">
    <form action={addComment}>
      <div className="flex flex-col">
        {/* <div className="flex flex-wrap -mx-3 mb-1"> */}
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <input className="appearance-none block w-full bg-gray-0 text-gray-700 border border-gray-400 rounded py-1 px-4 mb-3 leading-tight focus:outline-none focus:bg-white-500" 
                id="authorName" name="authorName" type="text" placeholder="名字"></input>
            </div>
            <div className="w-full md:w-1/2 px-3 mb-3">
                <input className="appearance-none block w-full bg-gray-0 text-grey-darker border border-gray-400 rounded py-1 px-4 leading-tight focus:outline-none focus:bg-white-500 focus:border-gray-600" 
                id="authorEmail" name="authorEmail" type="text" placeholder="邮箱"></input>
            </div>
        {/* </div> */}
        <textarea id="content" name="content"
        value={replyComment}  placeholder="神评妙论"
        onChange={(e) => setReplyComment(e.target.value)}
        className="appearance-none block w-90 text-gray-700 border border-gray-400 rounded py-3 px-4 ml-3 mb-3 leading-tight focus:outline-none focus:bg-white-500"
        cols={45} rows={4} required={true}></textarea>

        <div className="flex flex-row items-center justify-center">
          <input className="pr-6" type="submit" value="发表" />
          <button className="pl-6" onClick={cancelReplyBox}>取消</button>
        </div>
        {/* )} */}
        {/* <input type="hidden" name="comment_post_ID" value={postId} id="comment_post_ID" /> */}
      </div>
    </form>
    </div>
  );
}