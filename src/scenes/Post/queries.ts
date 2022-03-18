import { gql } from "@apollo/client";
import type { DocumentNode } from "graphql";

const CREATE_COMMENT: DocumentNode = gql`
  mutation CreateCommentMutation(
    $author: String!,
    $content: String!,
    $parentCommentId: ID,
    $parentPost: String!,
  ) {
    createComment(
      author: $author,
      content: $content,
      parentCommentId: $parentCommentId,
      parentPost: $parentPost,
    ) {
      success,
    }
  }
`;

const GET_POST_INFO: DocumentNode = gql`
  query GetPostInfo($postId: String!) {
    post(
      id: $postId,
    ) {
      id,
      title,
      author,
      content,
      votes,
      parentTopic {
        id,
        name,
        description,
      },
      commentSet {
        id,
        parentCommentId,
        content,
        author,
        parentPost {
          id,
        },
      },
    }
  }
`;

export {
  CREATE_COMMENT,
  GET_POST_INFO,
}
