import React, { useState } from 'react';
import api from '@/src/lib/api';
import { headers } from 'next/headers';
import AddComment from './AddComment';
import { Comment } from './types';

interface CommentProps {
  postId: string;
  comment: Comment;
}
const CommentComponent: React.FC<CommentProps> = ({ postId, comment }: CommentProps) => {
  const [curComment, setCurComment] = useState(comment);
  const [childrenComment, setChildrenComment] = useState(comment.children == undefined ? [] : comment.children);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyComment, setReplyComment] = useState('');

  const showingReplyBox = () => {
    setShowReplyBox(true);
  };
  const cancelReplyBox = () => {
    setShowReplyBox(false);
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // 使用本地化的日期格式
  };
  const updateComments = (newItem: Comment) => {
    try {
      // 添加新项目到数组, 保证页面可更新
      const addChild = (newItem: Comment) => {
        setChildrenComment(prevChildrenComment => [newItem, ...prevChildrenComment]);
      };
      addChild(newItem);
      setShowReplyBox(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };
  return (
  <div className="p-3 mb-6 mt-2 border border-gray-300 ">
    <h1></h1>
    <div className="wp-block-group is-layout-flow wp-block-group-is-layout-flow" >
      <div className="wp-block-group is-nowrap is-layout-flex wp-container-core-group-is-layout-11 wp-block-group-is-layout-flex">
			<div className="wp-block-group is-layout-flow wp-block-group-is-layout-flow">
        <div className="wp-block-comment-date">Date: {formatDate(comment.date)}</div>
				<div className="font-semibold text-xl">User: {curComment.author_name}</div>
			</div>

      </div>
      <div className="comment-content text-xl ml-12" dangerouslySetInnerHTML={{ __html: curComment.content.rendered }} />
    </div>
    { showReplyBox ? 
    (
      <button className='bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700 mt-2' onClick={cancelReplyBox}>
        Cancel Reply
      </button>
    ) : 
    (
      <button className='bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 mt-2' onClick={showingReplyBox}>
        Reply
      </button>
    )
  }

    { showReplyBox && (
      <AddComment postId={postId} commentParent={comment.id.toString()} updateComments={updateComments} author={curComment.author_name}/>)
  }
    {childrenComment && (
      <div className="comment-children">
        {childrenComment.map(child => (
        <CommentComponent key={child.id} postId={postId} comment={child} />
        ))}
      </div>
    )} 
  </div>
)};

export default CommentComponent;