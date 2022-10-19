import { observer } from "mobx-react-lite";
import React from "react";
import Board from "../models/Board";
import Topic from "../models/Topic";
import { useStore } from "../stores";
import BoardCard from "./BoardCard";
import BoardForm from "./BoardForm";
import Divider from "./Divider";

type Props = { topic: Topic };

const TopicCard: React.FC<Props> = ({ topic }) => {
  const boards = topic.boards;
  const store = useStore();
  const user = store.accountsStore.authenticated_user;

  const handleCreateBoard = async (name: string, description: string) => {
    await topic.createBoard(name, description, store.accountsStore.token);
  };

  return (
    <div className="flex flex-col bg-white p-10 border-b-2 mx-10 mb-5">
      <div>
        <span className="text-3xl text-gray-800">{topic.name}</span>
        <Divider />
        {user?.is_administrator && (
          <BoardForm handleCreateBoard={handleCreateBoard} />
        )}
      </div>
      <div className="text-xl my-3">Boards</div>
      <div className="grid grid-cols-5 gap-3 z-0">
        {boards.map((board: Board) => (
          <BoardCard key={board.pk} topicPk={topic.pk} board={board} />
        ))}
      </div>
    </div>
  );
};

export default observer(TopicCard);
