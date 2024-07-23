'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '@/src/lib/api';

export default function PaperPage( {params}: any) {
  const { id } = params;
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchPost();
  }, [id]);

  useEffect(() => {
    fetchComments();
  }, [id]);

  const fetchPost = async () => {
    try {
      const { data } = await api.get(`wp/v2/posts/${id}`);
      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const { data } = await api.get(`wp/v2/comments?post=${id}`);
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };
}
