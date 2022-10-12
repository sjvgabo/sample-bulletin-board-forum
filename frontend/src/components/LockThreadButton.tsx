import { observer } from "mobx-react-lite";
import React from "react";

type Props = {
  locked: boolean;
};

const LockThreadButton: React.FC<Props> = ({ locked }) => {
  return (
    <div>
      <span>{locked ? "UNLOCK" : "LOCK"}</span>
    </div>
  );
};

export default observer(LockThreadButton);
