import { observer } from "mobx-react-lite";
import React from "react";
import Board from "../models/Board";
import Topic from "../models/Topic";
import { useStore } from "../stores";
import BoardCard from "./BoardCard";
import BoardForm from "./BoardForm";

type Props = { topic: Topic };

const TopicCard: React.FC<Props> = ({ topic }) => {
  const boards = topic.boards;
  const store = useStore();
  const user = store.accountsStore.authenticated_user;

  const handleCreateBoard = async (name: string, description: string) => {
    await topic.createBoard(name, description, store.accountsStore.token);
  };
  return (
    <div className="flex flex-col bg-white p-5 border-b-2 mx-10 mb-5 rounded-md">
      <div>
        <span className="text-xl text-gray-800">{topic.name}</span>
        {user?.is_administrator && (
          <BoardForm handleCreateBoard={handleCreateBoard} />
        )}
      </div>
      <div className="flex flex-wrap">
        {boards.map((board: Board) => (
          <BoardCard key={board.pk} topicPk={topic.pk} board={board} />
        ))}
      </div>
    </div>
  );
};

export default observer(TopicCard);
