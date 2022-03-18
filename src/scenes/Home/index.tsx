import { useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import './index.css';
import { AllTopics } from 'components/AllTopics';
import { Navbar } from 'components/Navbar';
import { PostFeed } from 'components/PostFeed';
import { ToastMsg } from 'components/ToastMsg';
import {
  GET_ALL_POSTS,
  GET_PAG_TOPIC_NAMES
} from 'scenes/Home/queries';
import { PostScene } from 'scenes/Post';
import { TopicScene } from 'scenes/Topic';
import { UserScene } from 'scenes/User';

const Home: React.FC = (): JSX.Element => {
  return(
    <React.Fragment>
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route path={"/"} element={<Main />}/>
        <Route path={"/topic/:topicId"} element={<TopicScene />} />
        <Route path={"/user"} element={<UserScene />} />
        <Route path={"/post/:postId"} element={<PostScene />} />
      </Routes>
    </React.Fragment>
  )
};

const Main: React.FC = (): JSX.Element => {
  const handleQueryPostsError = (): void => {
    ToastMsg("Error getting posts");
  };
  const handleQueryTopicsError = (): void => {
    ToastMsg("Error getting topics");
  };

  const [ postPagination, setPostPagination] = useState(10);

  const {
    data: postsData,
    loading: postsLoading,
    refetch: refetchPosts
  } = useQuery(GET_ALL_POSTS, {
    onError: handleQueryPostsError,
  });

  const morePosts = () => {
    setPostPagination(postPagination + 10);
    refetchPosts();
  };

  const [ topicPagination, setTopicPagination] = useState(10);

  const { data: topicData, loading: topicLoading, refetch: refetchTopics } = useQuery(GET_PAG_TOPIC_NAMES, {
    onError: handleQueryTopicsError,
    variables: {
      first: topicPagination,
    }
  });

  const moreTopics = () => {
    setTopicPagination(topicPagination + 10);
    refetchTopics();
  };

  if (postsLoading || topicLoading) return (
    <p className="default-post-container">{"Loading..."}</p>
  );

  return(
    <React.Fragment>
      <div className="container">
        <div className="home-content">
          <PostFeed morePosts={morePosts} posts={postsData.posts}/>
        </div>
        <div className="home-content">
          <AllTopics moreTopics={moreTopics} allTopics={topicData.topics} />
        </div>
      </div>
    </React.Fragment>
  )
};

export { Home };
