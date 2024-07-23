// 获取单篇文章的评论
export async function getPostComments(postId: number) {
    const response = await fetch(`http://localhost:8081/wordpress/wp-json/wp/v2/comments?post=${postId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }
    const comments = await response.json();
    return comments;
  }