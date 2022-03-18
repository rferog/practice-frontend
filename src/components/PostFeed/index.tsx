import React from 'react';

import './index.css';
import { Post } from 'components/Post';
import { IPostFeed } from 'components/PostFeed/types';
import { CustomButton } from 'components/Buttons';

const PostFeed: React.FC<
  IPostFeed
  > = (props: IPostFeed): JSX.Element => {
  return(
    <React.Fragment>
      {props.posts.length ? props.posts.map(item =>
        <Post key={item.id} {...item} />
      ) : 
      <div className="default-post-container">
        {"There are no posts here yet"}
      </div>}
      <CustomButton
        onClick={props.morePosts}
        style="pagination-button"
      >
        {"More posts"}
      </CustomButton>
    </React.Fragment>
  )
}

export { PostFeed };
