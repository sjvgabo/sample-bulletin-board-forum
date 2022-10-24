import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import ErrorMessage from "../components/ErrorMessage";

import TopicCard from "../components/TopicCard";
import Topic from "../models/Topic";
import { useStore } from "../stores";
import getErrorMessage from "../utilities/getErrorMessage";

const HomePage: React.FC = () => {
  const store = useStore();
  const topics = store.contentStore.topics;
  const [error, setError] = useState<string>();

  useEffect(() => {
    (async () => {
      try {
        await store.contentStore.fetchTopics();
      } catch (err) {
        setError(getErrorMessage(err));
      }
    })();
  }, [store.contentStore]);

  return (
    <div className="h-auto min-h-full bg-slate-200 pt-10 flex justify-center">
      <div className="flex-1 max-w-5xl">
        {error && <ErrorMessage message={error} />}
        {topics &&
          topics.map((topic: Topic) => (
            <TopicCard key={topic.pk} topic={topic} />
          ))}
      </div>
    </div>
  );
};

export default observer(HomePage);
