import React from 'react';
import { CustomButton } from 'components/Buttons';
import {
  ITopicDescription,
  IUserDescription
} from 'components/Description/types';
import './index.css';

const TopicDescription: React.FC<ITopicDescription> = (
props: ITopicDescription
): JSX.Element => {
  return(
    <div className="topic-description-container">
      <div>
        <img 
          src="/image-icon.svg"
          width="200"
          height="200"
          alt="SubClone Icon"
        />
      </div>
      <h4>{props.name}</h4>
      <div>{props.description}</div>
    </div>
  )
}

const UserDescription: React.FC<IUserDescription> = (props): JSX.Element => {
  const creationDate = props.userDescription.dateJoined.split("T")[0];

  return(
    <div className="userdescription-container">
      <div>
        <img 
        src="/image-icon.svg"
        width="200"
        height="200"
        alt="User Icon" 
        />
      </div>
      <h4>{props.userDescription.username}</h4>
      <div>{`Creation Date: ${creationDate}`}</div>
    </div>
  )
}
  
export {
  TopicDescription,
  UserDescription
}
