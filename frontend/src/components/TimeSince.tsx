import moment from "moment";
import React from "react";

type Props = { date: Date };

const TimeSince: React.FC<Props> = ({ date }) => {
  const timeSince = moment(date).fromNow();
  return <span className="text-sm text-gray-500">{timeSince}</span>;
};

export default TimeSince;
