import React, { useEffect, useState } from "react";
import { useStore } from "../stores";
import { useParams } from "react-router";
import { observer } from "mobx-react-lite";
import Thread from "../models/Thread";
import ThreadCard from "../components/ThreadCard";

const BoardPage = () => {
  const store = useStore();
  let params: { boardPk: string; topicPk: string };
  params = useParams() as { boardPk: string; topicPk: string };
  const topic = store.contentStore.getTopic(parseInt(params.topicPk));
  const board = topic?.getBoard(parseInt(params.boardPk));

  const [pageNumber, setPageNumber] = useState<number>(1);

  useEffect(() => {
    (async () => {
      await board?.fetchThreads(pageNumber);
      console.log(board?.threads.length);
    })();
  }, [board, pageNumber]);

  return (
    <div className="bg-slate-200 h-auto p-10">
      <div className="bg-white p-10 flex flex-col">
        <div className="mb-10">
          <span className="text-2xl text-gray-800">{board?.name}</span>
        </div>
        <div className="flex flex-col">
          {/* STICKY */}

          {/* NON STICKY */}
          {board?.threads.map((thread: Thread) => (
            <ThreadCard
              key={thread.pk}
              isLocked={thread.isLocked}
              title={thread.title}
              threadPk={thread.pk}
              params={params}
            />
          ))}
        </div>
        {/* Pagination */}
        <nav>
          <ul>
            <li>Previous</li>
            <li>Next</li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default observer(BoardPage);
