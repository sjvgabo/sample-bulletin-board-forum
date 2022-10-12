import { observer } from "mobx-react-lite";
import React from "react";
import { useStore } from "../stores";
import TimeSince from "./TimeSince";

type Props = {
  authorPk: number;
  message: string;
  date: Date;
  postPk: number;
};

const PostCard: React.FC<Props> = ({ authorPk, message, date, postPk }) => {
  const store = useStore();
  const userPk = store.accountsStore.authenticated_user?.pk;

  const handleDelete = async () => {
    await store.contentStore.deletePost(postPk);
  };
  return (
    <div className="flex flex-col my-7">
      <div className="flex flex-col flex-grow ">
        <div className="flex">
          <span className="text-sm pr-2 font-semibold">
            Sample Author {authorPk}
          </span>
          <TimeSince date={date} />
        </div>
        <div>
          <span className="text-lg">{message}</span>
        </div>
      </div>
      {userPk === authorPk && (
        <div>
          <button
            className="text-xs bg-red-600 text-white p-1 rounded-md"
            onClick={handleDelete}
          >
            DELETE
          </button>
        </div>
      )}
    </div>
  );
};

export default observer(PostCard);
