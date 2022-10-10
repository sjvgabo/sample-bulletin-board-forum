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
    console.log('fetching threads')
    let response: Response;
    try {
      response = yield* _await(
        fetch(
          `${process.env.REACT_APP_API_BASE_LINK}/content/board/${this.pk}/threads?page=${pageNumber}`
        )
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
      let tempThreadList: Thread[];
      tempThreadList = [];
      data.forEach((thread: ThreadData) => {
        tempThreadList.push(
          new Thread({
            boardPk: thread.board_pk,
            title: thread.title,
            noOfPosts: thread.no_of_posts,
            pk: thread.pk,
            isSticky: thread.is_sticky,
            isLocked: thread.is_locked,
          })
        );
      });

      this.threads = tempThreadList;
    }
  });

  getThread = (threadPk: number) => {
    return this.threads.find(thread => thread.pk === threadPk)
  }
}
