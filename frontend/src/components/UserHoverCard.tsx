import { observer } from "mobx-react-lite";
import React from "react";
import User from "../models/User";
import { Loading } from "./Loading";

type Props = {
  user: User | undefined;
};
const UserHoverCard: React.FC<Props> = ({ user }) => {
  if (user) {
    return (
      <div className="bg-white border p-5 shadow-md ">
        <div className="font-semibold">{user.username}</div>
        <div className="italic text-sm">{user.about_myself}</div>
        <div className="text-sm">Posts: {user.user_num_posts}</div>
      </div>
    );
  }
  return (
    <div className="bg-white border rounded-sm p-5">
      <Loading />
    </div>
  );
};

export default observer(UserHoverCard);
