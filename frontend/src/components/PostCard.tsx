import { observer } from "mobx-react-lite";
import React from "react";
import { Link } from "react-router-dom";
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
  authorAvatarURL: string | undefined;
};

const PostCard: React.FC<Props> = ({
  authorPk,
  message,
  date,
  postPk,
  authorUsername,
  thread,
  authorAvatarURL,
}) => {
  const store = useStore();
  const userPk = store.accountsStore.authenticated_user?.pk;
  const token = store.accountsStore.token;

  const handleDelete = async () => {
    if (thread) {
      await thread.deletePost(postPk, token);
    }
  };

  return (
    <div className="flex gap-5 my-7">
      {/* User Avatar */}
      <Avatar link={authorAvatarURL} />

      {/* Post Info */}
      <div className="flex flex-col">
        <div className="flex flex-col flex-grow ">
          <div>
            <Link to={`/profile/${authorPk}`}>
              <span className="text-sm pr-2 font-semibold">
                {authorUsername}
              </span>
            </Link>
            <TimeSince date={date} />
          </div>
          <div>
            <span className="text-lg">{message}</span>
          </div>
        </div>
        {userPk === authorPk && (
          <div>
            {thread && (
              <button
                className="text-xs  text-gray-400 rounded-md"
                onClick={handleDelete}
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default observer(PostCard);
