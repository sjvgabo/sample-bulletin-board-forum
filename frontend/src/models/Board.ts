import { Model, model, modelFlow, prop, _async, _await } from "mobx-keystone";
import { tokenCtx } from "../stores/store";
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
};

@model("bulletinboard/Board")
export default class Board extends Model({
  topic_pk: prop<number>(),
  name: prop<string>(),
  description: prop<string>(),
  no_of_threads: prop<number>(0),
  no_of_posts: prop<number>(0),
  pk: prop<number>(),
  threads: prop<Thread[]>(() => []),
}) {
  // Fetches board threads from database
  @modelFlow
  fetchThreads = _async(function* (this: Board, pageNumber: number = 1) {
    console.log("fetching threads");
    let response: Response;
    try {
      response = yield* _await(
        fetch(
          `${process.env.REACT_APP_API_BASE_LINK}/content/board/${this.pk}/threads/?page=${pageNumber}`
        )
      );
    } catch (error) {
      console.error(error);
      return;
    }

    let data: any = [];
    try {
      data = yield* _await(response.json());
    } catch (error) {
      console.error(error);
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
        })
    );
  });

  getThread = (threadPk: number) => {
    return this.threads.find((thread) => thread.pk === threadPk);
  };

  addThread = (thread: Thread) => {
    this.threads.push(thread);
  };

  @modelFlow
  createThread = _async(function* (
    this: Board,
    title: string,
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
    } else {
      alert("Thread failed to be deleted. Check authorization.");
    }
  });
}
