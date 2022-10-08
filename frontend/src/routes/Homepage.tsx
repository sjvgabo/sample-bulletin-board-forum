import { truncate } from "fs/promises";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import { Loading } from "../components/Loading";
import TopicCard from "../components/TopicCard";
import Topic from "../models/Topic";
import { useStore } from "../stores";

const Homepage = () => {
  const store = useStore();
  const topics = store.contentStore.topics;
  const boardsLoaded = useRef(true);

  // useEffect(() => {
  //   (async() => {topics.forEach(async (topic) => {
  //     await topic.fetchBoards();
  //   });
  //   boardsLoaded.current = true})()
  //   console.log("home page rerendering")
  // }, []);

  return (
    <div className="h-screen bg-slate-200 pt-10">
      <div className="">
        {boardsLoaded ? (
          <div className="">
            {topics.map((topic: Topic) => (
              <TopicCard key={topic.pk} topic={topic} />
            ))}
          </div>
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
};

export default Homepage;
