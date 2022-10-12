import { observer } from "mobx-react-lite";
import React from "react";


const Divider:React.FC = () => {
  return <hr className="my-5"/>;
}

export default observer(Divider);
