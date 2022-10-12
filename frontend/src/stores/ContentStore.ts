import { Model, model, modelFlow, prop, _async, _await } from "mobx-keystone";
import Board, { ThreadData } from "../models/Board";
import Thread from "../models/Thread";
import Topic, { BoardData } from "../models/Topic";
import { tokenCtx } from "./store";

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

  @modelFlow
  createPost = _async(function* (
    this: ContentStore,
    message: string,
    threadPk: number,
    authorPk: number
  ) {
    const token = tokenCtx.get(this);
    
    let response: Response;
    alert(authorPk);
    try {
      response = yield* _await(
        fetch(`${process.env.REACT_APP_API_BASE_LINK}/content/post/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            author: authorPk,
            message: message,
            thread: threadPk,
          }),
        })
      );
    } catch (error) {
      alert("Error creating new post");
      return;
    }
  });

  @modelFlow
  deletePost = _async(function* (this: ContentStore, postPk: number) {
    const token = tokenCtx.get(this);
    let response: Response;
    try {
      response = yield* _await(
        fetch(
          `${process.env.REACT_APP_API_BASE_LINK}/content/post/${postPk}/`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
          }
        )
      );
    } catch (error) {
      alert("Error in deleting the post");
      return;
    }

    if (!response.ok) {
      alert(response.body);
    }
  });

  @modelFlow
  createThread = _async(function* (
    this: ContentStore,
    title: string,
    boardPk: number,
    authorPk: number
  ) {
    const token = tokenCtx.get(this);
    let response: Response;
    try {
      response = yield* _await(
        fetch(`${process.env.REACT_APP_API_BASE_LINK}/content/thread/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            author: authorPk,
            title: title,
            board: boardPk,
          }),
        })
      );
    } catch (error) {
      alert("Error creating new post");
      return;
    }

    if (response.ok) {
      alert("Succesfully created thread");
    } else {
      alert("Error in database. Failed to created thread");
    }
  });

  @modelFlow
  createBoard = _async(function* (
    this: ContentStore,
    name: string,
    description: string,
    topicPk: number
  ) {
    const token = tokenCtx.get(this);
    let response: Response;
    try {
      response = yield* _await(
        fetch(`${process.env.REACT_APP_API_BASE_LINK}/content/board/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            name: name,
            description: description,
            topic: topicPk,
          }),
        })
      );
    } catch (error) {
      alert("Error creating new board");
      return;
    }

    if (response.ok) {
      alert("Succesfully created board");
    } else {
      alert("Error in database. Failed to created new board.");
      return;
    }
  });

  @modelFlow
  deleteThread = _async(function* (this: ContentStore, threadPk: number) {
    const token = tokenCtx.get(this);
    let response: Response;
    try {
      response = yield* _await(
        fetch(
          `${process.env.REACT_APP_API_BASE_LINK}/content/post/${threadPk}/`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
          }
        )
      );
    } catch (error) {
      alert("Error in deleting the thread");
      return;
    }

    if (!response.ok) {
      alert(response.body);
    }
  });

  @modelFlow
  deleteBoard = _async(function* (this: ContentStore, boardPk: number) {
    const token = tokenCtx.get(this);
    let response: Response;
    try {
      response = yield* _await(
        fetch(
          `${process.env.REACT_APP_API_BASE_LINK}/content/board/${boardPk}/`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
          }
        )
      );
    } catch (error) {
      alert("Error in deleting the Board");
      return;
    }

    if (!response.ok) {
      alert(response.body);
    }
  });
}
