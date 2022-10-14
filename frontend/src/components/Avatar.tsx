import { observer } from "mobx-react-lite";
import React from "react";
import default_pic from "../static/default_pic.png";

type Props = {
  link: string | undefined;
};
const Avatar: React.FC<Props> = ({ link }) => {
  const imageLink = link || default_pic;
  return (
    <div className="rounded">
      <img className="h-10 rounded-full" src={imageLink} alt="user avatar" />
    </div>
  );
};

export default observer(Avatar);
