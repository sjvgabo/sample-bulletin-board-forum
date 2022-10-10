import { observer } from "mobx-react-lite";
import React from "react";
import Board from "../models/Board";
import Topic from "../models/Topic";
import BoardCard from "./BoardCard";

const TopicCard = ({ topic }: { topic: Topic }) => {
  const boards = topic.boards;

  return (
    <div
      className="flex flex-col bg-white p-5 border-b-2 mx-10 mb-5 rounded-md
    "
    >
      <div>
        <span className="text-xl text-gray-800">{topic.name}</span>
      </div>
      <div className="flex ">
        {boards.map((board: Board) => (
            <BoardCard key={board.pk} name={board.name} topicPk={topic.pk} boardPk={board.pk} description={board.description} />
        ))}
      </div>
    </div>
  );
};

export default observer(TopicCard);
