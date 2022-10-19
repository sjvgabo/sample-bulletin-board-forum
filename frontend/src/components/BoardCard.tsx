import { observer } from "mobx-react-lite";
import React from "react";
import { Link } from "react-router-dom";
import Board from "../models/Board";
import BoardHoverCard from "./BoardHoverCard";

type Props = {
  topicPk: number;
  board: Board;
};

const BoardCard: React.FC<Props> = ({ topicPk, board }) => (
  <Link to={`topic/${topicPk}/board/${board.pk}`}>
    <div className="z-0 flex flex-col bg-sky-100 p-5 m-2 rounded-sm group text-center">
      <span className="text-gray-800 font-semibold">{board.name}</span>
      <div className="invisible group-hover:visible relative">
        <BoardHoverCard board={board} />
      </div>
    </div>
  </Link>
);

export default observer(BoardCard);
