export interface IPost {
  id: string;
  votes: number;
  author: string;
  title: string;
  content: string;
  parentTopic: {
    id: string;
    name: string;
  };
  comments?: IComment[]
}

export interface IComment {
  id: string;
  parentCommentId: string | null;
  content: string;
  author: string;
  parentPost: {
    id: string;
  };
  children?: IComment[];
}
