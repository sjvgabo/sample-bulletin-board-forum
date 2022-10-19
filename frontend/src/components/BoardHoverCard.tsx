import { observer } from "mobx-react-lite";
import React from "react";
import Board from "../models/Board";

type Props = {
  board: Board;
};
const UserHoverCard: React.FC<Props> = ({ board }) => {
  return (
    <div className="bg-white border p-5 shadow-md absolute z-20 text-left">
      <div className="text-sm text-gray-500 italic">{board.description}</div>
      <div className="text-sm text-gray-500">
        Threads: {board.no_of_threads}
      </div>
      <div className="text-sm text-gray-500">Posts: {board.no_of_posts}</div>
    </div>
  );
};

export default observer(UserHoverCard);
