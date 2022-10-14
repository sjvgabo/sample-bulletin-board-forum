import { Model, model, modelFlow, prop, _async, _await } from "mobx-keystone";
import Post from "./Post";

export type PostData = {
  pk: number;
  author: number;
  message: string;
  thread: number;
  date_created: Date;
  author_username: string;
};

@model("bulletinboard/Thread")
export default class Thread extends Model({
  pk: prop<number>(),
  title: prop<string>(),
  boardPk: prop<number>(),
  isSticky: prop<boolean>(),
  isLocked: prop<boolean>().withSetter(),
  noOfPosts: prop<number>(),
  authorPk: prop<number>(),
  authorUsername: prop<string>(),
  posts: prop<Post[]>(() => []),
  lastReplied: prop<Date>(),
  lastRepliedUsername: prop<string>(),
}) {
  @modelFlow
  fetchPosts = _async(function* (this: Thread, pageNumber: number = 1) {

    let response: Response;
    try {
      response = yield* _await(
        fetch(
          `${process.env.REACT_APP_API_BASE_LINK}/content/thread/${this.pk}/posts?page=${pageNumber}`
        )
      );
    } catch (error) {
      alert("Error in fetching posts from the database")
      return;
    }

    let data: any = [];
    try {
      data = yield* _await(response.json());
    } catch (error) {
      alert("Error in parsing response data")
      return;
    }

    this.posts = data.map(
      (post: PostData) =>
        new Post({
          authorPk: post.author,
          pk: post.pk,
          threadPk: post.thread,
          message: post.message,
          date_created: post.date_created,
          authorUsername: post.author_username,
        })
    );
  });

  @modelFlow
  toggleLockThread = _async(function* (this: Thread, token: string) {
    const lockData = {
      is_locked: !this.isLocked,
    };
    let response: Response;
    try {
      response = yield* _await(
        fetch(
          `${process.env.REACT_APP_API_BASE_LINK}/content/thread/${this.pk}/`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
            body: JSON.stringify(lockData),
          }
        )
      );
    } catch (error) {
      alert("Update Error: Error in database.");
      return;
    }

    if (response.ok) {
      this.setIsLocked(!this.isLocked);
      this.isLocked
        ? alert("Thread successfully locked")
        : alert("Thread successfully unlocked");
    } else {
      alert(token);
      alert("Error in locking thread.");
    }
  });

  @modelFlow
  createPost = _async(function* (
    this: Thread,
    message: string,
    threadPk: number,
    authorPk: number,
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
      yield* _await(this.fetchPosts());
    }
  });

  @modelFlow
  deletePost = _async(function* (this: Thread, postPk: number, token: string) {
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
      yield* _await(this.fetchPosts());
    } else {
      alert("Error in deleting the post");
    }
  });
}
