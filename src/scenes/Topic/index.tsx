import { useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { useParams } from 'react-router';

import './index.css';
import { TopicDescription } from 'components/Description';
import { PostFeed } from 'components/PostFeed';
import { ToastMsg } from 'components/ToastMsg';
import { GET_TOPIC_INFO } from 'scenes/Topic/queries';
import { IPost } from 'components/Post/types';

const TopicScene: React.FC = (): JSX.Element => {
  const { topicId } = useParams();

  const handleQueryError = (): void => {
    ToastMsg("Error getting posts");
  };

  const [ topicPagination, setTopicPagination] = useState(10);

  const { data, loading, refetch } = useQuery(GET_TOPIC_INFO, {
    onError: handleQueryError,
    variables: {
      topicId,
      first: topicPagination,
    },
  });

  const morePosts = () => {
    setTopicPagination(topicPagination + 10);
    refetch();
  };

  if (loading) return <p className="default-post-container">{"Loading..."}</p>;

  const postSet = data.topic.postSet.edges.map(
    (item: { node: IPost }) => item.node
  );
  
  return(
    <React.Fragment>
      <div className="topic-container">
        <div className="topic-feed">
          <PostFeed morePosts={morePosts} posts={postSet} />
        </div>
        <div className="topic-description">
          {data ? <TopicDescription name={data.topic.name} description={data.topic.description} />
          : undefined}
        </div>
      </div>
    </React.Fragment>
  )
}
  
export { TopicScene };
