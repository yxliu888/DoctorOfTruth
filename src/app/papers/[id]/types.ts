// Comment 类型定义
export interface Comment {
  id: number;
  author_name: string;
  content: {
    rendered: string;
  };
  parent: number; // 父评论的 ID
  children?: Comment[]; // 子评论数组
  date: string;
}