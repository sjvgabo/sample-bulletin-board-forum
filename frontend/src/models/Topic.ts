import { Model, model, modelFlow, prop, _async, _await } from "mobx-keystone";
import Board from "./Board";

type BoardData = {
  threads: number[];
  pk: number;
  name: string;
  description: string;
  no_of_threads: number;
  no_of_posts: number;
  topic: number;
};

@model("bulletinboard/Topic")
export default class Topic extends Model({
  name: prop<string>(),
  pk: prop<number>(),
  boards: prop<Board[]>(() => []),
}) {
  @modelFlow
  fetchBoards = _async(function* (this: Topic, pageNumber: number = 1) {
    let response: Response;
    try {
      response = yield* _await(
        fetch(
          `${process.env.REACT_APP_API_BASE_LINK}/content/topic/${this.pk}/boards?page=${pageNumber}`
        )
      );
    } catch (error) {
      console.log("FETCH ERROR:", error);
      return [];
    }
    let data: any;
    try {
      data = yield* _await(response.json());
    } catch (error) {
      console.log("PARSE ERROR", error);
      return [];
    }
    if (Array.isArray(data)) {
      let tempBoardsList: Board[];
      tempBoardsList = [];
      data.forEach((board: BoardData) => {
        tempBoardsList.push(
          new Board({
            topic_pk: board.topic,
            name: board.name,
            description: board.description,
            no_of_threads: board.no_of_threads,
            no_of_posts: board.no_of_posts,
            pk: board.pk,
          })
        );
      });
      this.boards = tempBoardsList
      return
    }
  });
  
}
