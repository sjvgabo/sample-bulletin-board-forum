import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import EditBoardTopicForm from "../components/EditBoardTopicForm";
import Paginator from "../components/Paginator";
import ThreadCard from "../components/ThreadCard";
import ThreadForm from "../components/ThreadForm";
import Thread from "../models/Thread";
import { useStore } from "../stores";

const BoardPage: React.FC = () => {
  const navigate = useNavigate();
  const store = useStore();
  let params: { boardPk: string; topicPk: string };
  params = useParams() as { boardPk: string; topicPk: string };
  const token = store.accountsStore.token;
  const topic = store.contentStore.getTopic(parseInt(params.topicPk, 10));
  const board = store.contentStore?.getBoard(
    parseInt(params.topicPk, 10),
    parseInt(params.boardPk, 10)
  );
  const threads = store.contentStore.threads[parseInt(params.boardPk, 10)];

  // To check whether user has permissions to certain features
  const userNotBanned = !store.accountsStore.authenticated_user?.is_banned;
  const isAunthenticated = store.accountsStore.authenticated;
  const isAdmin = store.accountsStore.authenticated_user?.is_administrator;

  // For pagination
  const [pageNumber, setPageNumber] = useState<number>(1);
  const defaultPageItems = 20;
  const [pageCount, setPageCount] = useState<number>(1);

  const handleDelete = async () => {
    await topic?.deleteBoard(parseInt(params.boardPk), token);
    navigate("/");
  };

  const handlePageClick = (selectedItem: { selected: number }): void => {
    setPageNumber(selectedItem.selected + 1);
  };

  const handleChangeTopic = async (topicPk: number) => {
    if (board && topic) {
      await board?.changeTopic(token, topicPk);
      await store.contentStore.fetchTopics();
    }
  };

  useEffect(() => {
    (async () => {
      if (!topic) {
        await store.contentStore.fetchTopics();
      }
      if (!board) {
        await store.contentStore.fetchBoard(
          parseInt(params.boardPk, 10),
          parseInt(params.topicPk, 10)
        );
      }
      if (!threads) {
        await store.contentStore.fetchThreads(
          parseInt(params.boardPk, 10),
          pageNumber
        );
      }
      if (board) {
        setPageCount(Math.ceil(board?.no_of_threads / defaultPageItems));
      }
    })();
  }, [
    board,
    pageNumber,
    params.boardPk,
    params.topicPk,
    store.contentStore,
    threads,
    topic,
  ]);

  return (
    <div className="bg-slate-200 h-auto min-h-full p-10 flex justify-center">
      <div className="bg-white p-10 flex flex-col max-w-5xl flex-1">
        <div className="mb-10">
          <span className="text-2xl text-gray-800 block">{board?.name}</span>
          {/* DELETE BOARD (Will only show if user is an administrator) */}
          {isAdmin && board && (
            <>
              <button
                className="text-xs bg-red-600 text-white p-1 rounded-md"
                onClick={handleDelete}
              >
                DELETE
              </button>
              <EditBoardTopicForm
                handleChangeTopic={handleChangeTopic}
                topicPk={board.topic_pk}
              />
            </>
          )}
        </div>

        {/* CREATE NEW THREAD (Will only show if authenticated) */}
        {isAunthenticated && userNotBanned && board && (
          <ThreadForm board={board} />
        )}
        {!userNotBanned && isAunthenticated && (
          <span>Banned user detected. You cannot create a thread.</span>
        )}

        {/* THREADS */}
        <div className="flex flex-col">
          {threads &&
            threads.map((thread: Thread) => (
              <ThreadCard key={thread.pk} params={params} thread={thread} />
            ))}
        </div>
        {/* Pagination */}
        <Paginator handlePageClick={handlePageClick} pageCount={pageCount} />
      </div>
    </div>
  );
};

export default observer(BoardPage);
