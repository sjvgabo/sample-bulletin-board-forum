import { observer } from "mobx-react-lite";
import React from "react";
import TimeSince from "./TimeSince";

const PostCard = ({
  authorPk,
  message,
  date,
}: {
  authorPk: number;
  message: string;
  date: Date;
}) => {
  return (
    <div className="flex flex-col my-7">
      <div className="flex">
        <span className="text-sm pr-2 font-semibold">Sample Author</span>
        <TimeSince date={date} />
      </div>
      <div>
        <span className="text-lg">{message}</span>
      </div>
    </div>
  );
};

export default observer(PostCard);
