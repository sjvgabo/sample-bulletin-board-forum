import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import ThreadCard from "../components/ThreadCard";
import ThreadForm from "../components/ThreadForm";
import Thread from "../models/Thread";
import { useStore } from "../stores";

const BoardPage: React.FC = () => {
  const store = useStore();
  let params: { boardPk: string; topicPk: string };
  params = useParams() as { boardPk: string; topicPk: string };
  const topic = store.contentStore.getTopic(parseInt(params.topicPk));
  const board = topic?.getBoard(parseInt(params.boardPk));

  const [pageNumber, setPageNumber] = useState<number>(1);

  const handleDelete = async () => {
    await store.contentStore.deleteBoard(parseInt(params.boardPk));
  };

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
          {/* DELETE BOARD (Will only show if user is an administrator) */}
          {store.accountsStore.authenticated_user?.is_administrator && <button
            className="text-xs bg-red-600 text-white p-1 rounded-md"
            onClick={handleDelete}
          >
            DELETE
          </button>}
        </div>

        {/* CREATE NEW THREAD (Will only show if authenticated) */}
        {store.accountsStore.authenticated && (
          <ThreadForm boardPk={parseInt(params.boardPk)} />
        )}

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
