import React from 'react';

import './index.css';
import { IAllTopics } from 'components/AllTopics/types';
import { CustomButton } from 'components/Buttons';

const AllTopics: React.FC<IAllTopics> = (
  props: IAllTopics
): JSX.Element => {
  return(
    <React.Fragment>
      <div className="topics-container">
        <h4 className="topic-cell">
          {"All Topics"}
        </h4>
        {props.allTopics ? props.allTopics.map(topic => 
          <a 
            key={topic.id}
            className="topic-cell"
            href={`/topic/${topic.id}`}
          >
              {topic.name}
          </a>
        ) : <div className="topic-cell">{"No topics created yet"}</div>}
      </div>
      <CustomButton
        onClick={props.moreTopics}
        style="pagination-button"
      >
        {"More topics"}
      </CustomButton>
    </React.Fragment>
  )
}
  
export { AllTopics }
