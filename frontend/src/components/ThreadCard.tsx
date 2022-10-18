import { observer } from "mobx-react-lite";
import React from "react";
import { Link } from "react-router-dom";
import Thread from "../models/Thread";
import TimeSince from "./TimeSince";

type Props = {
  params: { boardPk: string; topicPk: string };
  thread: Thread;
};

const ThreadCard: React.FC<Props> = ({ params, thread }) => (
  <Link
    to={`/topic/${params.topicPk}/board/${params.boardPk}/thread/${thread.pk}`}
  >
    <div className="p-3 bg-sky-200 my-1 rounded-sm flex flex-col">
      <div>
        <span>
          {thread.isSticky && "[STICKY]"}
          {thread.isLocked && "[LOCKED] "}
          {thread.title}
        </span>
      </div>
      <div>
        <span className="text-sm pl-2 text-gray-500">
          Created by: {thread.authorUsername}
        </span>
        {thread.lastRepliedUsername ? (
          <span className="text-sm pl-2 text-gray-500">
            Last replied: <TimeSince date={thread.lastReplied} /> by{" "}
            {thread.lastRepliedUsername}
          </span>
        ) : (
          <span className="text-sm pl-2 text-gray-500">
            No post created yet
          </span>
        )}
      </div>
    </div>
  </Link>
);

export default observer(ThreadCard);
