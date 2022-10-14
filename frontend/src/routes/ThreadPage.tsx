import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DeleteButton from "../components/DeleteButton";
import Divider from "../components/Divider";
import { Loading } from "../components/Loading";
import LockThreadButton from "../components/LockThreadButton";
import Paginator from "../components/Paginator";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import Board from "../models/Board";
import Thread from "../models/Thread";
import { useStore } from "../stores";
import ErrorPage from "./ErrorPage";

const ThreadPage: React.FC = () => {
  const store = useStore();
  const navigate = useNavigate();
  const isAunthenticated = store.accountsStore.authenticated;
  const userNotBanned = !store.accountsStore.authenticated_user?.is_banned;
  const userModOrAdmin =
    store.accountsStore.authenticated_user?.is_administrator ||
    store.accountsStore.authenticated_user?.is_moderator;

  let params: { boardPk: string; topicPk: string; threadPk: string };
  params = useParams() as {
    boardPk: string;
    topicPk: string;
    threadPk: string;
  };
  const [board, setBoard] = useState<Board>();
  const [loading, setLoading] = useState(true);
  const [thread, setThread] = useState<Thread>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageCount, setPageCount] = useState<number>(1);
  const itemPerPage = 20;

  useEffect(() => {
    (async () => {
      setBoard(
        (await store.contentStore.fetchBoard(parseInt(params.boardPk))) as Board
      );

      const newThread = (await store.contentStore.fetchThread(
        parseInt(params.threadPk)
      )) as Thread;

      setThread(newThread);
      await newThread?.fetchPosts(pageNumber);
      setPageCount(Math.ceil(newThread.noOfPosts / itemPerPage));
      setLoading(false);
    })();
  }, [pageNumber, params.boardPk, params.threadPk, store.contentStore]);

  const handleLockClick = async () => {
    thread?.toggleLockThread(store.token);
  };

  const handleThreadDelete = async () => {
    if (thread && board) {
      await board?.deleteThread(thread.pk, store.accountsStore.token);
      navigate(`/topic/${params.topicPk}/board/${params.boardPk}/`);
    }
  };

  const handlePageClick = (selectedItem: { selected: number }): void => {
    setPageNumber(selectedItem.selected + 1);
  };

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="bg-slate-200 min-h-full h-auto p-10">
      {board && thread ? (
        <div className="bg-white p-5">
          {/* Board and Thread info */}
          <Link to={`/topic/${params.topicPk}/board/${params.boardPk}`}>
            <span>{board.name}</span>
          </Link>
          <h1 className="text-2xl font-bold mb-10 pb-2">{thread?.title}</h1>
          {userModOrAdmin && isAunthenticated && (
            <>
              <LockThreadButton
                handleLockClick={handleLockClick}
                locked={thread.isLocked}
              />
              <DeleteButton handleDelete={handleThreadDelete} />
            </>
          )}
          <Divider />
          {/* Post list arranged according to post date descending */}
          {thread.posts.length > 0 ? (
            <div className="ml-5">
              {thread.posts.map((post) => (
                <PostCard
                  key={post.pk}
                  authorPk={post.authorPk}
                  message={post.message}
                  date={post.date_created}
                  postPk={post.pk}
                  authorUsername={post.authorUsername}
                  authorAvatarURL={post.authorAvatarURL}
                  thread={thread}
                />
              ))}
            </div>
          ) : (
            <div>No posts yet</div>
          )}

          {/* Pagination */}
          <Paginator handlePageClick={handlePageClick} pageCount={pageCount} />

          {/* Reply form */}
          <div>
            {!thread.isLocked && isAunthenticated && userNotBanned && (
              <PostForm
                threadPk={parseInt(params.threadPk)}
                thread={thread}
                token={store.accountsStore.token}
              />
            )}
            {/* If user is banned, this shows instead of form */}
            {!userNotBanned && isAunthenticated && (
              <span>Banned user detected. You cannot post in this thread.</span>
            )}
          </div>
        </div>
      ) : (
        <ErrorPage />
      )}
    </div>
  );
};

export default observer(ThreadPage);
