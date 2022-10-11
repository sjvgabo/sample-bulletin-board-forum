import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Loading } from "../components/Loading";
import PostCard from "../components/PostCard";
import Board from "../models/Board";
import Thread from "../models/Thread";
import { useStore } from "../stores";
import ErrorPage from "./ErrorPage";

const ThreadPage: React.FC = () => {
  const store = useStore();
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

      setLoading(false);
    })();
  }, [pageNumber, params.boardPk, params.threadPk, store.contentStore]);

  console.log("Thread posts", thread?.posts);
  console.log(params);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="bg-slate-200 min-h-full h-auto p-10">
      {/* Shows error if board and/or thread is undefined */}
      {board && thread ? (
        <div className="bg-white p-5">
          {/* Board and Thread info */}
          <Link to={`/topic/${params.topicPk}/board/${params.boardPk}`}>
            <span>{board.name}</span>
          </Link>
          <h1 className="text-2xl font-bold mb-10 pb-2 border-b-2">
            {thread?.title}
          </h1>

          {/* Post list arranged according to post date descending */}
          {thread.posts.length > 0 ? (
            <div>
              {thread.posts.map((post) => (
                <PostCard
                  key={post.pk}
                  authorPk={post.authorPk}
                  message={post.message}
                  date={post.date_created}
                />
              ))}
            </div>
          ) : (
            <div>No posts yet </div>
          )}

          {/* Reply component */}
          <div>
            <form className="flex flex-col">
              <input className="border-2 h-20 mb-2"></input>
              <button className="bg-slate-400 text-white px-2 py-1 rounded">
                Comment
              </button>
            </form>
          </div>
        </div>
      ) : (
        <ErrorPage />
      )}
    </div>
  );
};

export default observer(ThreadPage);
