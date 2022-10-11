import { observer } from "mobx-react-lite";
import React from "react";
import { Link } from "react-router-dom";

type Props = {
  topicPk: number;
  boardPk: number;
  name: string;
  description: string;
};

const BoardCard: React.FC<Props> = ({
  topicPk,
  boardPk,
  name,
  description,
}) => (
  <Link to={`topic/${topicPk}/board/${boardPk}`}>
    <div className="flex flex-col bg-slate-200 p-5 m-5 rounded-md">
      <span className="text-gray-800">{name}</span>

      <span className="text-sm text-gray-500">{description}</span>
    </div>
  </Link>
);

export default observer(BoardCard);
