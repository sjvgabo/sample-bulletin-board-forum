import { observer } from "mobx-react-lite";
import React from "react";
import { Link } from "react-router-dom";

type Props = {
  isLocked: boolean;
  title: string;
  threadPk: number;
  params: { boardPk: string; topicPk: string };
};

const ThreadCard: React.FC<Props> = ({ isLocked, title, threadPk, params }) => {
  return (
    <Link
      to={`/topic/${params.topicPk}/board/${params.boardPk}/thread/${threadPk}`}
    >
      <div className="p-3 bg-sky-200 my-1 rounded-sm flex flex-col">
        <span>
          {isLocked && "[LOCKED] "}
          {title}
        </span>
        <span className="text-sm pl-2 text-gray-500">Last replied:</span>
      </div>
    </Link>
  );
};

export default observer(ThreadCard);
