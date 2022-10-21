import { Model, model, modelFlow, prop, _async, _await } from "mobx-keystone";
import Board from "../models/Board";
import Post from "../models/Post";
import Thread from "../models/Thread";
import Topic from "../models/Topic";

type TopicData = {
  pk: number;
  name: string;
};

export type ThreadData = {
  pk: number;
  title: string;
  is_sticky: boolean;
  is_locked: boolean;
  no_of_posts: number;
  board: number;
  author: number;
  author_username: string;
  last_replied: Date;
  last_replied_user: string;
};

export type BoardData = {
  pk: number;
  name: string;
  description: string;
  no_of_threads: number;
  no_of_posts: number;
  topic: number;
};

export type PostData = {
  pk: number;
  author: number;
  message: string;
  thread: number;
  date_created: Date;
  author_username: string;
  avatar_url: string | undefined;
};

type Threads = {
  [boardPk: number]: Thread[];
};
type Boards = {
  [topicPk: number]: Board[];
};
type Posts = {
  [threadPk: number]: Post[];
};

// Handles content (topics, boards, posts, threads)
@model("bulletin-board/ContentStore")
export default class ContentStore extends Model({
  topics: prop<Topic[]>(() => []),
  threads: prop<Threads>(),
  boards: prop<Boards>(),
  posts: prop<Posts>(),
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

    let data: any = [];
    try {
      data = yield* _await(response.json());
    } catch (error) {
      console.error(error);
      return;
    }
    this.topics = data.map(
      (topic: TopicData) =>
        new Topic({
          pk: topic.pk,
          name: topic.name,
        })
    );
  });

  // return a single topic through its pk
  getTopic = (topicPk: number) => {
    return this.topics.find((topic: Topic) => topic.pk === topicPk);
  };

  @modelFlow
  clearThreads = (boardPk: number) => {
    delete this.threads[boardPk];
  };

  @modelFlow
  fetchThreads = _async(function* (
    this: ContentStore,
    boardPk: number,
    pageNumber: number = 1
  ) {
    let response: Response;
    response = yield* _await(
      fetch(
        `${process.env.REACT_APP_API_BASE_LINK}/content/thread/?board=${boardPk}&page=${pageNumber}`
      )
    );
    let data: {
      count: number;
      next: string | undefined;
      previous: string | undefined;
      results: ThreadData[];
    };
    data = yield* _await(response.json());

    if (!this.threads) {
      this.threads = {};
    }

    if (data.results) {
      this.threads[boardPk] = data.results.map(
        (thread: ThreadData) =>
          new Thread({
            boardPk: thread.board,
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
    }
  });

  @modelFlow
  fetchBoard = _async(function* (
    this: ContentStore,
    boardPk: number,
    topicPk: number
  ) {
    let response: Response;
    response = yield* _await(
      fetch(`${process.env.REACT_APP_API_BASE_LINK}/content/board/${boardPk}`)
    );

    let boardData: BoardData;
    boardData = yield* _await(response.json());

    let board: Board;
    board = new Board({
      topic_pk: boardData.topic,
      name: boardData.name,
      description: boardData.description,
      no_of_threads: boardData.no_of_threads,
      no_of_posts: boardData.no_of_posts,
      pk: boardData.pk,
    });
    if (!this.boards[topicPk]) {
      this.boards[topicPk] = [];
    }
    // To prevent duplicates
    if (this.boards[topicPk].filter((t) => t.pk === board.pk).length === 0)
      this.boards[topicPk].push(board);
  });

  getBoard = (topicPk: number, boardPk: number) => {
    if (this.boards[topicPk]) {
      return this.boards[topicPk].find((board) => board.pk === boardPk);
    }
  };

  @modelFlow
  fetchThread = _async(function* (
    this: ContentStore,
    boardPk: number,
    threadPk: number
  ) {
    let response: Response;
    response = yield* _await(
      fetch(`${process.env.REACT_APP_API_BASE_LINK}/content/thread/${threadPk}`)
    );

    let threadData: ThreadData;
    threadData = yield* _await(response.json());

    let thread: Thread;
    thread = new Thread({
      boardPk: threadData.board,
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

    if (!this.threads[boardPk]) {
      this.threads[boardPk] = [];
    }
    // To prevent duplicates
    if (this.threads[boardPk].filter((t) => t.pk === thread.pk).length === 0) {
      this.threads[boardPk].push(thread);
    }
  });

  // Get thread from threads
  getThread = (boardPk: number, threadPk: number) => {
    if (this.threads[boardPk]) {
      return this.threads[boardPk].find((thread) => thread.pk === threadPk);
    }
  };

  @modelFlow
  createThread = _async(function* (
    this: ContentStore,
    title: string,
    authorPk: number,
    boardPk: number,
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
      yield* _await(this.fetchThreads(boardPk));
    } else {
      alert("Error in database. Failed to created thread");
    }
  });

  @modelFlow
  deleteThread = _async(function* (
    this: ContentStore,
    threadPk: number,
    token: string,
    boardPk: number
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
      yield* _await(this.fetchThreads(boardPk));
    } else {
      alert("Thread failed to be deleted. Check authorization.");
    }
  });

  // Fetch posts from api
  @modelFlow
  fetchPosts = _async(function* (
    this: ContentStore,
    threadPk: number,
    pageNumber: number = 1
  ) {
    let response: Response;
    response = yield* _await(
      fetch(
        `${process.env.REACT_APP_API_BASE_LINK}/content/post/?page=${pageNumber}&thread=${threadPk}`
      )
    );

    let data: any = [];
    data = yield* _await(response.json());

    this.posts[threadPk] = data.results.map(
      (post: PostData) =>
        new Post({
          authorPk: post.author,
          pk: post.pk,
          threadPk: post.thread,
          message: post.message,
          date_created: post.date_created,
          authorUsername: post.author_username,
          authorAvatarURL: post.avatar_url,
        })
    );
  });

  @modelFlow
  createPost = _async(function* (
    this: ContentStore,
    message: string,
    threadPk: number,
    authorPk: number,
    boardPk: number,
    token: string
  ) {
    let response: Response;
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
    if (response.ok) {
      yield* _await(this.fetchPosts(threadPk));
      yield* _await(this.fetchThreads(boardPk));
    }
  });

  @modelFlow
  deletePost = _async(function* (
    this: ContentStore,
    postPk: number,
    token: string,
    threadPk: number
  ) {
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
      alert("Database Error: Error in deleting the post");
      return;
    }

    if (response.ok) {
      yield* _await(this.fetchPosts(threadPk));
    } else {
      alert("Error in deleting the post");
    }
  });
}
