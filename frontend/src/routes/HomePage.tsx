import { observer } from "mobx-react-lite";
import React from "react";
import TopicCard from "../components/TopicCard";
import Topic from "../models/Topic";
import { useStore } from "../stores";

const HomePage: React.FC = () => {
  const store = useStore();
  const topics = store.contentStore.topics;

  return (
    <div className="h-auto min-h-full bg-slate-200 pt-10">
      <div className="">
        <div className="">
          {topics.map((topic: Topic) => (
            <TopicCard key={topic.pk} topic={topic} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default observer(HomePage);
