import {
  useMutation,
  useQuery
} from '@apollo/client';
import {
  ErrorMessage,
  Field,
  Form,
  Formik
} from 'formik';
import jwt_decode from 'jwt-decode';
import React, { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import './index.css';
import { CustomButton } from 'components/Buttons';
import { TopicDescription } from 'components/Description';
import { Post } from 'components/Post';
import { IComment } from 'components/Post/types';
import { ToastMsg } from 'components/ToastMsg';
import { IUserInfo } from 'components/Navbar/types';
import {
  CREATE_COMMENT,
  GET_POST_INFO
} from 'scenes/Post/queries';
import { ICommentBox } from 'scenes/Post/types';

const PostScene: React.FC = (): JSX.Element => {
  const { postId } = useParams();
  
  const handleQueryError = (): void => {
    ToastMsg("Error getting post");
  };

  const { data, loading } = useQuery(GET_POST_INFO, {
    onError: handleQueryError,
    variables: {
      postId,
    },
  });

  const nest = (items: IComment[] | undefined, id: string | null = null): IComment[] => {
    return( items ? items
    .filter(item => item.parentCommentId === id)
    .map(item => ({ ...item, children: nest(items, item.id) })) : 
    [])
  };

  if (loading) return <p className="post-content">{"Loading..."}</p>;

  const nestedComments = nest(data.post.commentSet);

  return(
    <React.Fragment>
      <div className="scene-post-container">
        <div className="scene-post-content">
          <Post {...data.post} />
          <div className="comments-container">
            <h4>{"Comments"}</h4>
            <CommentBox parentPost={data.post.id}/>
            <hr />
            { nestedComments.length ?
            <ul className="pa-5">
              {nestedComments.map(comment => (
                <Comment key={comment.id} {...comment} />
              ))}
            </ul> :
            <div>
              {"No comments yet"}
            </div>}
          </div>
        </div>
        <div className="scene-topic-description">
          <TopicDescription
            name={data.post.parentTopic.name}
            description={data.post.parentTopic.description}
          />
        </div>
      </div>
    </React.Fragment>
  )
}

const Comment: React.FC<IComment> = (props: IComment): JSX.Element => {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const handleShowCommentBox = () => setShowCommentBox(!showCommentBox);

  return(
    <React.Fragment>
      <strong>{`Author: ${props.author}`}</strong>
      <div className={props.parentCommentId ? "comment" : "flex-column"}>
        {props.content}
        {showCommentBox ? 
          <CommentBox
            onCancel={handleShowCommentBox}
            parentComment={props}
            parentPost={props.parentPost.id}
          /> :
          <a
            className="comment-reply-button"
            onClick={handleShowCommentBox}
          >
            {"Reply"}
          </a>
        }
        <ul>
          {props.children?.map(child => <Comment key={child.id} {...child} />)}
        </ul>
      </div>
    </React.Fragment>
  )
};

const CommentBox: React.FC<ICommentBox> = (props: ICommentBox): JSX.Element => {
  const navigate = useNavigate();
  const commentInitialValue = {
    content: "",
  };

  const handleCreateCommentResult = (result: number): void => {
    if (result) {
      ToastMsg("Comment posted successfully");
    };
  };

  const handleCreateCommentError = (): void => {
    ToastMsg("Error posting comment, please try again");
  };

  const [createComment] = useMutation(CREATE_COMMENT,
    {
      onCompleted: handleCreateCommentResult,
      onError: handleCreateCommentError,
    });

  const handleCommentSubmit = useCallback(
    (values: {
      content: string;
    }): void => {
      const token = localStorage.getItem("token");
      if (token) {
        const userInfo: IUserInfo = jwt_decode(token);
        void createComment({
          variables: {
            author: userInfo.username,
            content: values.content,
            parentCommentId: props.parentComment ? props.parentComment.id : undefined,
            parentPost: props.parentPost,
          },
        });
        navigate(0);
      } else {
        ToastMsg("In order to comment you must log in");
      };
    },
    [createComment]
  );

  return(
    <React.Fragment>
      <Formik
        initialValues={commentInitialValue}
        onSubmit={handleCommentSubmit}
      >
        {({
          dirty,
        }) => (
          <Form>
            <div>
              <Field
                component="textarea"
                rows="5"
                cols="50"
                name="content"
                placeholder="Write a comment"
              />
              <ErrorMessage name="content" component="div" />
            </div>
            <CustomButton
              disabled={!dirty}
              type="submit"
            >
              {"Comment"}
            </CustomButton>
            {props.parentComment ? 
              <CustomButton
                onClick={props.onCancel}
                style={"comment-cancel-button"}
              >
                {"Cancel"}
              </CustomButton> :
              undefined
            }
          </Form>
        )}
      </Formik>
    </React.Fragment>
  )
}

export { PostScene };
