import { Model, model, modelFlow, prop, _async, _await } from "mobx-keystone";
import Post from "./Post";

type PostData = {
  pk: number;
  author_pk: number;
  message: string;
  thread_pk: number;
  date_created: Date;
};

@model("bulletinboard/Thread")
export default class Thread extends Model({
  pk: prop<number>(),
  title: prop<string>(),
  boardPk: prop<number>(),
  isSticky: prop<boolean>(),
  isLocked: prop<boolean>(),
  noOfPosts: prop<number>(),
  posts: prop<Post[]>(() => []),
}) {
  @modelFlow
  fetchPosts = _async(function* (this: Thread, pageNumber: number = 1) {
    console.log("fetching posts");

    let response: Response;
    try {
      response = yield* _await(
        fetch(
          `${process.env.REACT_APP_API_BASE_LINK}/content/thread/${this.pk}/posts?page=${pageNumber}`
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

    this.posts = data.map(
      (post: PostData) =>
        new Post({
          authorPk: post.author_pk,
          pk: post.pk,
          threadPk: post.thread_pk,
          message: post.message,
          date_created: post.date_created,
        })
    );
  });
}
