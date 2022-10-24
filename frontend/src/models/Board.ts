import { Model, model, modelFlow, prop, _async, _await } from "mobx-keystone";

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
  no_of_threads: prop<number>().withSetter(),
  no_of_posts: prop<number>(),
  pk: prop<number>(),
}) {
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

    if (response.ok) {
      this.setTopic_pk(topicPk);
      alert("Successfully moved the board.");
    } else {
      let error: string;
      error = yield* _await(response.text());
      throw error;
    }
  });
}
