export interface IAllTopics {
  moreTopics: () => void;
  allTopics: {
    id: string,
    name: string,
  }[];
};
