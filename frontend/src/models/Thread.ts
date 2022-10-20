import { Model, model, modelFlow, prop, _async, _await } from "mobx-keystone";
import Post from "./Post";

export type PostData = {
  pk: number;
  author: number;
  message: string;
  thread: number;
  date_created: Date;
  author_username: string;
  avatar_url: string | undefined;
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
}
