import { observer } from "mobx-react-lite";
import React from "react";
import { Link } from "react-router-dom";
import Board from "../models/Board";

type Props = {
  topicPk: number;
  board: Board;
};

const BoardCard: React.FC<Props> = ({ topicPk, board }) => (
  <Link to={`topic/${topicPk}/board/${board.pk}`}>
    <div className="flex flex-col bg-slate-200 p-5 m-5 rounded-md">
      <span className="text-gray-800">{board.name}</span>
      <span className="text-sm text-gray-500">{board.description}</span>
      <span className="text-sm text-gray-500">
        Threads: {board.no_of_threads}
      </span>
      <span className="text-sm text-gray-500">Posts: {board.no_of_posts}</span>
    </div>
  </Link>
);

export default observer(BoardCard);
