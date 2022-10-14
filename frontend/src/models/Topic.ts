import { Model, model, modelFlow, prop, _async, _await } from "mobx-keystone";
import Board from "./Board";

export type BoardData = {
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
      return;
    }

    let data: any = [];
    try {
      data = yield* _await(response.json());
    } catch (error) {
      console.log("PARSE ERROR", error);
      return;
    }

    this.boards = data.map(
      (board: BoardData) =>
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

  getBoard = (boardPk: number) => {
    return this.boards.find((board) => board.pk === boardPk);
  };

  onInit() {
    this.fetchBoards();
  }

  @modelFlow
  deleteBoard = _async(function* (this: Topic, boardPk: number, token: string) {
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

    if (response.ok) {
      alert("Board deleted");
      yield* _await(this.fetchBoards());
    } else {
      alert("Error in deleting board. Check authentication.");
    }
  });

  @modelFlow
  createBoard = _async(function* (
    this: Topic,
    name: string,
    description: string,
    token: string
  ) {
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
            topic: this.pk,
          }),
        })
      );
    } catch (error) {
      alert("Error creating new board");
      return;
    }

    if (response.ok) {
      alert("Succesfully created board");
      yield* _await(this.fetchBoards());
    } else {
      alert("Error in database. Failed to created new board.");
      return;
    }
  });
}
