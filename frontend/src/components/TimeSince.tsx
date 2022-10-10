import moment from "moment";


export default function TimeSince({date}: {date: Date} ) {

  let timeSince: string;
  timeSince = moment(date).fromNow();
  return (
    <span className="text-sm text-gray-500">{timeSince}</span>
  )
  
}