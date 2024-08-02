import axios from 'axios';
import { useEffect, useState } from 'react';
import api from '@/src/lib/api';
import CommentComponent from './CommentComponent';
import AddComment from './AddComment';
import { Comment } from './types';

// 递归组织评论数据
function organizeComments(comments: Comment[]): any {
  const organizedComments: Comment[] = [];
  comments.forEach(comment => {
    if (comment.parent === 0) {
      console.log('parent comment:', comment);
      // 如果是顶级评论，直接放入 organizedComments
      organizedComments.push(comment);
    } else {
      console.log('child comment:', comment);
      // 查找父评论并将当前评论放入父评论的 children 数组中
      const parentComment = organizedComments.find(c => c.id === comment.parent);
      if (parentComment) {
        if (!parentComment.children) {
          parentComment.children = [];
        }
        parentComment.children.push(comment);
      } else {
        // 查找父评论并将当前评论放入父评论的 children 数组中
        const parentComment1 = comments.find(c => c.id === comment.parent);
        if (parentComment1) {
          if (!parentComment1.children) {
            parentComment1.children = [];
          }
          parentComment1.children.push(comment);
        }
      }
    }
  });
  return organizedComments;
} 
interface CommentProps {
  postId: string;
}
export default function Comments({ postId }: CommentProps) {
  //const { postId } = params;
  const [comments, setComments] = useState<Comment[]>([]);
  // const [showReplyBox, setShowReplyBox] = useState(false);

  // const showingReplyBox = () => {
  //   setShowReplyBox(true);
  // };
  // const cancelReplyBox = () => {
  //   setShowReplyBox(false);
  // };

  useEffect(() => {
    fetchComment();
  }, []);
   // 获取单篇文章的评论
   const fetchComment = async () => {
    try {
      if (postId != undefined){
      const { data } = await api.get(`wp/v2/comments?post=${postId}`);
      setComments(organizeComments(data));
      //setComments(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };
  
  const updateComments = (newItem: Comment) => {
    try {
      // 添加新项目到数组, 保证页面可更新
      const addChild = (newItem: Comment) => {
        setComments(prevChildrenComment => [newItem, ...prevChildrenComment]);
      };
      addChild(newItem);
      // setShowReplyBox(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };
  return (
    <div>
      {/* <button className="mt-8 mb-4 font-semibold" onClick={showingReplyBox}>发表评论</button>
      {showReplyBox && ( */}
      <AddComment postId={postId} commentParent='0' updateComments={updateComments}/>
      {/* } */}
      <h1 className='mb-6 text-2xl mt-8 font-bold '>Comments</h1>
      <div className='ml-10'>
        {comments.map((comment: any) => (
            <CommentComponent key={comment.id} postId={postId} comment={comment} />
          ))
        }
      </div>
    </div>
  );
}