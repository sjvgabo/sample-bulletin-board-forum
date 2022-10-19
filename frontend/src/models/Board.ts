import { Model, model, modelFlow, prop, _async, _await } from "mobx-keystone";
import Thread from "./Thread";

export type ThreadData = {
  pk: number;
  posts: number[];
  title: string;
  is_sticky: boolean;
  is_locked: boolean;
  no_of_posts: number;
  board_pk: number;
  author: number;
  author_username: string;
  last_replied: Date;
  last_replied_user: string;
};

@model("bulletinboard/Board")
export default class Board extends Model({
  topic_pk: prop<number>().withSetter(),
  name: prop<string>(),
  description: prop<string>(),
  no_of_threads: prop<number>(0).withSetter(),
  no_of_posts: prop<number>(0),
  pk: prop<number>(),
  threads: prop<Thread[]>(() => []),
}) {
  // Fetches board threads from database
  @modelFlow
  fetchThreads = _async(function* (this: Board, pageNumber: number = 1) {
    let response: Response;
    try {
      response = yield* _await(
        fetch(
          `${process.env.REACT_APP_API_BASE_LINK}/content/board/${this.pk}/threads/?page=${pageNumber}`
        )
      );
    } catch (error) {
      alert("Error in fetching data from database.");
      return;
    }

    let data: any = [];
    try {
      data = yield* _await(response.json());
    } catch (error) {
      alert("Error in parsing response data");
      return;
    }

    this.threads = data.map(
      (thread: ThreadData) =>
        new Thread({
          boardPk: thread.board_pk,
          title: thread.title,
          noOfPosts: thread.no_of_posts,
          pk: thread.pk,
          isSticky: thread.is_sticky,
          isLocked: thread.is_locked,
          authorPk: thread.author,
          authorUsername: thread.author_username,
          lastReplied: thread.last_replied,
          lastRepliedUsername: thread.last_replied_user,
        })
    );
  });

  getThread = (threadPk: number) => {
    return this.threads.find((thread) => thread.pk === threadPk);
  };

  addThread = (thread: Thread) => {
    this.threads.push(thread);
  };

  onAttachedToRootStore() {
    this.fetchThreads();
  }

  @modelFlow
  createThread = _async(function* (
    this: Board,
    title: string,
    authorPk: number,
    token: string
  ) {
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
            board: this.pk,
          }),
        })
      );
    } catch (error) {
      alert("Error creating new post");
      return;
    }

    if (response.ok) {
      alert("Succesfully created thread");
      yield* _await(this.fetchThreads());
    } else {
      alert("Error in database. Failed to created thread");
    }
  });

  @modelFlow
  deleteThread = _async(function* (
    this: Board,
    threadPk: number,
    token: string
  ) {
    let response: Response;
    try {
      response = yield* _await(
        fetch(
          `${process.env.REACT_APP_API_BASE_LINK}/content/thread/${threadPk}/`,
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

    if (response.ok) {
      alert("Thread deleted");
      yield* _await(this.fetchThreads());
    } else {
      alert("Thread failed to be deleted. Check authorization.");
    }
  });

  @modelFlow
  changeTopic = _async(function* (this: Board, token: string, topicPk: number) {
    if (topicPk === this.topic_pk) {
      alert("Same value detected. Please select a different topic.");
      return;
    }
    const topicData = {
      topic: topicPk,
    };
    let response: Response;
    try {
      response = yield* _await(
        fetch(
          `${process.env.REACT_APP_API_BASE_LINK}/content/board/${this.pk}/`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
            body: JSON.stringify(topicData),
          }
        )
      );
    } catch (error) {
      alert("Update Error: Error in database.");
      return;
    }

    if (response.ok) {
      this.setTopic_pk(topicPk);

      alert("Successfully moved the board.");
    } else {
      alert("Error in changing the board topic.");
    }
  });

  @modelFlow
  fetchThread = _async(function* (this: Board, threadPk: number) {
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
      authorPk: threadData.author,
      authorUsername: threadData.author_username,
      lastRepliedUsername: threadData.last_replied_user,
      lastReplied: threadData.last_replied,
    });
    // To prevent duplicates
    if (this.threads.filter((t) => t.pk === thread.pk).length === 0)
      this.threads.push(thread);
    thread.fetchPosts();
  });
}
