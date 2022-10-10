import { action } from "mobx";
import { Model, model, modelFlow, prop, _async, _await } from "mobx-keystone";
import Topic from "../models/Topic";

type TopicData = {
  pk: number;
  name: string;
};
// Handles content (topics, boards, posts, threads)
@model("bulletin-board/ContentStore")
export default class ContentStore extends Model({
  topics: prop<Topic[]>(() => []),
}) {
  @modelFlow
  fetchTopics = _async(function* (this: ContentStore) {
    let response: Response;
    try {
      response = yield* _await(
        fetch(`${process.env.REACT_APP_API_BASE_LINK}/content/topic/`)
      );
    } catch (error) {
      console.error(error);
      return [];
    }
    let data: any;
    try {
      data = yield* _await(response.json());
    } catch (error) {
      console.error(error);
      return [];
    }
    if (Array.isArray(data)) {
      let tempTopicList: Topic[];
      tempTopicList = [];
      data.forEach((topic: TopicData) => {
        tempTopicList.push(
          new Topic({
            pk: topic.pk,
            name: topic.name,
          })
        );
      });

      this.topics = tempTopicList;
    }
  });
}
