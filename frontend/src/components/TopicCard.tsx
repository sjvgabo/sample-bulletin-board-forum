import { observer } from "mobx-react-lite";
import React from "react";
import Topic from "../models/Topic";

const TopicCard = ({ topic }: { topic: Topic }) => {
  const boards = topic.fetchBoards();
  console.log("boards", boards);

  return (
    <div
      className="flex flex-col bg-white p-5 border-b-2 mx-10 mb-5 rounded-md
    "
    >
      <div>
        <span className="text-xl text-gray-800">{topic.name}</span>
      </div>
      <div>
        <span>{topic.boards.toString()}</span>
      </div>
    </div>
  );
};

export default observer(TopicCard);
