import { observer } from "mobx-react-lite";
import React from "react";
import Thread from "../models/Thread";
import { useStore } from "../stores";
import Avatar from "./Avatar";
import TimeSince from "./TimeSince";

type Props = {
  authorPk: number;
  message: string;
  date: Date;
  postPk: number;
  authorUsername: string;
  thread?: Thread;
};

const PostCard: React.FC<Props> = ({
  authorPk,
  message,
  date,
  postPk,
  authorUsername,
  thread
}) => {
  const store = useStore();
  const userPk = store.accountsStore.authenticated_user?.pk;

  const handleDelete = async () => {
    if (thread) {
      await thread.deletePost(postPk, store.token);
    }
  };
  
  return (
    <div className="flex gap-5 my-7">
      {/* User Avatar */}
      <div>
        <Avatar />
      </div>
      

      {/* Post Info */}
      <div className="flex flex-col">
        <div className="flex flex-col flex-grow ">
          <div className="flex">
            <span className="text-sm pr-2 font-semibold">{authorUsername}</span>
            <TimeSince date={date} />
          </div>
          <div>
            <span className="text-lg">{message}</span>
          </div>
        </div>
        {userPk === authorPk && (
          <div>
            {thread &&
            <button
              className="text-xs bg-red-600 text-white p-1 rounded-md"
              onClick={handleDelete}
            >
              DELETE
            </button>}
          </div>
        )}
      </div>
    </div>
  );
};

export default observer(PostCard);
