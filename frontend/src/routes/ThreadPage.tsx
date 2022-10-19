import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DeleteThreadButton from "../components/DeleteThreadButton";
import Divider from "../components/Divider";
import { Loading } from "../components/Loading";
import LockThreadButton from "../components/LockThreadButton";
import Paginator from "../components/Paginator";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import Thread from "../models/Thread";
import { useStore } from "../stores";
import ErrorPage from "./ErrorPage";

const ThreadPage: React.FC = () => {
  const store = useStore();
  const navigate = useNavigate();
  const token = store.accountsStore.token;
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
  const topic = store.contentStore.getTopic(parseInt(params.topicPk, 10));
  const board = topic?.getBoard(parseInt(params.boardPk, 10));
  const thread = board?.getThread(parseInt(params.threadPk, 10)) as Thread;
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageCount, setPageCount] = useState<number>(1);
  const itemPerPage = 20;
  useEffect(() => {
    (async () => {
      await board?.fetchThread(parseInt(params.threadPk, 10));
      if (thread) {
        await thread.fetchPosts(pageNumber);
        setPageCount(Math.ceil(thread.noOfPosts / itemPerPage));
        setLoading(false);
      }
    })();

    if (thread) {
    }
  }, [board, pageNumber, params.threadPk, thread]);

  const handleLockClick = async () => {
    if (thread) {
      thread?.toggleLockThread(token);
    }
  };

  const handleThreadDelete = async () => {
    if (thread && board) {
      await board?.deleteThread(thread.pk, token);
      navigate(`/topic/${params.topicPk}/board/${params.boardPk}/`);
    }
  };

  const handlePageClick = (selectedItem: { selected: number }): void => {
    setPageNumber(selectedItem.selected + 1);
  };

  if (loading) {
    return <Loading />;
  }
  if (thread) {
    return (
      <div className="bg-slate-200 min-h-full h-auto p-10 flex justify-center">
        {board && thread ? (
          <div className="bg-white p-5 max-w-5xl flex-1">
            {/* Board and Thread info */}
            <Link to={`/topic/${params.topicPk}/board/${params.boardPk}`}>
              <span>{board.name}</span>
            </Link>
            <h1 className="text-xl font-bold mb-3 pb-2">{thread?.title}</h1>
            {userModOrAdmin && isAunthenticated && (
              <div className="flex gap-2">
                <LockThreadButton
                  handleLockClick={handleLockClick}
                  locked={thread.isLocked}
                />
                <DeleteThreadButton handleDelete={handleThreadDelete} />
              </div>
            )}
            <Divider />
            {/* Post list arranged according to post date descending */}
            {thread.posts.length > 0 ? (
              <div className="ml-5">
                {thread.posts.map((post) => (
                  <PostCard key={post.pk} post={post} thread={thread} />
                ))}
              </div>
            ) : (
              <div>No posts yet</div>
            )}

            {/* Pagination */}
            <Paginator
              handlePageClick={handlePageClick}
              pageCount={pageCount}
            />

            {/* Reply form */}
            <div>
              {!thread.isLocked && isAunthenticated && userNotBanned && (
                <PostForm
                  threadPk={parseInt(params.threadPk)}
                  thread={thread}
                  token={token}
                />
              )}
              {/* If user is banned, this shows instead of form */}
              {!userNotBanned && isAunthenticated && (
                <span>
                  Banned user detected. You cannot post in this thread.
                </span>
              )}
            </div>
          </div>
        ) : (
          <ErrorPage />
        )}
      </div>
    );
  }
  return <ErrorPage />;
};

export default observer(ThreadPage);
