import { Model, model, modelFlow, prop, _async, _await } from "mobx-keystone";
import Board, { ThreadData } from "../models/Board";
import Thread from "../models/Thread";
import Topic, { BoardData } from "../models/Topic";

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

  // return a single topic throught its pk
  getTopic = (topicPk: number) => {
    return this.topics.find((topic: Topic) => topic.pk === topicPk);
  };

  // Fetch a single board through its pk
  @modelFlow
  fetchBoard = _async(function* (this: ContentStore, boardPk: number) {
    let response: Response;
    try {
      response = yield* _await(
        fetch(`${process.env.REACT_APP_API_BASE_LINK}/content/board/${boardPk}`)
      );
    } catch (error) {
      return;
    }
    let data: BoardData;
    try {
      data = yield* _await(response.json());
    } catch (error) {
      return;
    }
    return new Board({
      topic_pk: data.topic,
      name: data.name,
      description: data.description,
      no_of_threads: data.no_of_threads,
      no_of_posts: data.no_of_posts,
      pk: data.pk,
    });
  });

  // fetch thread using its pk
  @modelFlow
  fetchThread = _async(function* (this: ContentStore, threadPk: number) {
    let response: Response;
    try {
      response = yield* _await(
        fetch(
          `${process.env.REACT_APP_API_BASE_LINK}/content/thread/${threadPk}`
        )
      );
    } catch (error) {
      return;
    }

    let threadData: ThreadData;
    try {
      threadData = yield* _await(response.json());
    } catch (error) {
      return;
    }

    let thread: Thread;
    thread = new Thread({
      boardPk: threadData.board_pk,
      title: threadData.title,
      noOfPosts: threadData.no_of_posts,
      pk: threadData.pk,
      isSticky: threadData.is_sticky,
      isLocked: threadData.is_locked,
    });
    thread.fetchPosts();
    return thread;
  });
}
