import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import Board from "../models/Board";
import Topic from "../models/Topic";
import { useStore } from "../stores";
import getErrorMessage from "../utilities/getErrorMessage";
import BoardCard from "./BoardCard";
import BoardForm from "./BoardForm";
import Divider from "./Divider";
import ErrorMessage from "./ErrorMessage";
import { Loading } from "./Loading";

type Props = { topic: Topic };

const TopicCard: React.FC<Props> = ({ topic }) => {
  const boards = topic.boards;
  const store = useStore();
  const user = store.accountsStore.authenticated_user;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  const handleCreateBoard = async (name: string, description: string) => {
    await topic.createBoard(name, description, store.accountsStore.token);
  };

  useEffect(() => {
    (async () => {
      try {
        await topic.fetchBoards();
        setLoading(false);
      } catch (error) {
        setError(getErrorMessage(error));
      }
    })();
  }, [topic]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col bg-white p-10 border-b-2 mx-10 mb-5 min-w-fit">
      <div>
        <span className="text-3xl text-gray-800">{topic.name}</span>
        <Divider />
        {user?.is_administrator && (
          <BoardForm handleCreateBoard={handleCreateBoard} />
        )}
      </div>
      <div className="text-xl my-3">Boards</div>
      <div className="grid grid-cols-4 gap-3 z-0">
        {error && <ErrorMessage message={error} />}
        {boards.map((board: Board) => (
          <BoardCard key={board.pk} topicPk={topic.pk} board={board} />
        ))}
      </div>
    </div>
  );
};

export default observer(TopicCard);
