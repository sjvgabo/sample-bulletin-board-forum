import { observer } from "mobx-react-lite";
import React from "react";
import { Link } from "react-router-dom";

type Props = {
  isLocked: boolean;
  title: string;
  threadPk: number;
  authorUsername: string;
  params: { boardPk: string; topicPk: string };
  isSticky: boolean;
};

const ThreadCard: React.FC<Props> = ({
  isLocked,
  title,
  threadPk,
  params,
  authorUsername,
  isSticky,
}) => {
  return (
    <Link
      to={`/topic/${params.topicPk}/board/${params.boardPk}/thread/${threadPk}`}
    >
      <div className="p-3 bg-sky-200 my-1 rounded-sm flex flex-col">
        <div>
          <span>
            {isSticky && "[STICKY]"}
            {isLocked && "[LOCKED] "}
            {title}
          </span>
        </div>
        <div>
          <span className="text-sm pl-2 text-gray-500">
            Created by: {authorUsername}
          </span>
          <span className="text-sm pl-2 text-gray-500">Last replied:</span>
        </div>
      </div>
    </Link>
  );
};

export default observer(ThreadCard);
