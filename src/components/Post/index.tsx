import React from 'react';
import './index.css';
import { CustomButton } from 'components/Buttons';
import { IPost } from 'components/Post/types';

const Post: React.FC<IPost> = (props: IPost): JSX.Element => {
  return(
    <React.Fragment>
      <a className="post-parent-container" href={`/post/${props.id}`}>
        <div className="votes-container">
          <CustomButton style="arrow">
            <img
              src="/arrow-up.svg"
              width="20"
              height="20"
              alt="Arrow Up Icon"
            />
          </CustomButton>
          <div className="votes-number">
            {props.votes}
          </div>
          <CustomButton style="arrow">
            <img
              src="/arrow-down.svg"
              width="20"
              height="20"
              alt="Arrow Up Icon"
            />
          </CustomButton>
        </div>
        <div className="post-container">
          <div className="post-header">
            {`Topic: ${props.parentTopic.name} | Author: ${props.author}`}
          </div>
          <div className="post-title">
            {props.title}
          </div>
          <h5 className="post-content">
            {props.content}
          </h5>
        </div>
      </a>
    </React.Fragment>
  )
}
  
export { Post }
